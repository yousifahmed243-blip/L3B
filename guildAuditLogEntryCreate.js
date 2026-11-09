const { Events, AuditLogEvent, PermissionsBitField } = require('discord.js');
const db = require('../utils/database');

// Memory storage for recent moderation actions per user
const actionTracker = new Map();

module.exports = {
  name: Events.GuildAuditLogEntryCreate,
  async execute(auditLogEntry, guild, client) {
    // Check if protection is enabled globally
    const protectionEnabled = db.get('protection.enabled', true);
    if (!protectionEnabled) return;

    const { action, executorId } = auditLogEntry;
    if (!executorId || executorId === client.user.id) return;

    // Check if executor is Guild Owner
    if (executorId === guild.ownerId) return;

    // Check if executor is Whitelisted
    const whitelistedUsers = db.get('protection.whitelist.users', []);
    if (whitelistedUsers.includes(executorId)) return;

    const member = await guild.members.fetch(executorId).catch(() => null);
    if (member) {
      const whitelistedRoles = db.get('protection.whitelist.roles', []);
      const hasWhitelistedRole = member.roles.cache.some(r => whitelistedRoles.includes(r.id));
      if (hasWhitelistedRole) return;
    }

    // Map audit actions to protection types
    let actionType = null;
    if (action === AuditLogEvent.MemberBanAdd) actionType = 'ban';
    else if (action === AuditLogEvent.MemberKick) actionType = 'kick';
    else if (action === AuditLogEvent.ChannelDelete) actionType = 'channel_delete';
    else if (action === AuditLogEvent.RoleDelete) actionType = 'role_delete';

    if (!actionType) return;

    // Check if this module is enabled
    const moduleKey = actionType === 'ban' || actionType === 'kick' ? 'anti_ban' : (actionType === 'channel_delete' ? 'anti_channel' : 'anti_role');
    const moduleEnabled = db.get(`protection.modules.${moduleKey}`, true);
    if (!moduleEnabled) return;

    // Track action count within 1 hour
    const now = Date.now();
    const userActions = actionTracker.get(executorId) || [];
    const recent = userActions.filter(act => act.type === actionType && (now - act.time < 3600000));
    recent.push({ type: actionType, time: now });
    actionTracker.set(executorId, recent);

    const limitConfig = db.get(`protection.limits.${actionType}`, { limit: 3, punishment: 'ban' });

    if (recent.length > limitConfig.limit) {
      console.warn(`[ANTI-RAID TRIGGERED] User ${executorId} exceeded ${actionType} limit (${recent.length} > ${limitConfig.limit}) in ${guild.name}`);

      if (!member) return;

      // Execute punishment
      try {
        if (limitConfig.punishment === 'ban') {
          await guild.members.ban(executorId, { reason: `[SHIELD PROTECTION] تجاوز الحد المسموح لإجراء (${actionType})` });
        } else if (limitConfig.punishment === 'kick') {
          await member.kick(`[SHIELD PROTECTION] تجاوز الحد المسموح لإجراء (${actionType})`);
        } else if (limitConfig.punishment === 'remove_roles') {
          const removableRoles = member.roles.cache.filter(r => r.id !== guild.id && r.editable);
          await member.roles.remove(removableRoles, '[SHIELD PROTECTION] سحب الرتب لتجاوز الحد الأمني');
        }
      } catch (punishErr) {
        console.error('[PUNISHMENT FAILED]:', punishErr.message);
      }
    }
  }
};
