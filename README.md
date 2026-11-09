# 🛡️ Discord Shield & Multi-Tool Bot (v14)

بوت ديسكورد متكامل واحترافي يضم أنظمة:
- **نظام الحماية والوايت ليست (Anti-Nuke & Whitelist)**
- **نظام النسخ الاحتياطي (Backup System)**
- **أوامر الإشراف والإدارة المتقدمة (Moderation)**
- **نظام التحكم بالقنوات (Channel Management)**
- **الردود التلقائية الذكية (Auto Response)**
- **نظام المتاجر والطلبات والتقييمات (Delivery & Reviews)**
- **أوامر المعلومات والإحصائيات (General & Info)**

---

## 🚀 طريقة التثبيت والتشغيل السريع (Quick Start)

### 1. المتطلبات:
- تثبيت **Node.js** بإصدار 18 فما فوق (Node.js v18.0.0+)
- حساب مطور في [Discord Developer Portal](https://discord.com/developers/applications)

### 2. تثبيت الحزم:
افتح موجه الأوامر (Terminal) في مجلد المشروع واكتب:
```bash
npm install
```

### 3. ضبط ملف البيئة (.env):
قم بإعادة تسمية ملف `.env.example` إلى `.env` وأضف التوكن الخاص بك:
```env
DISCORD_TOKEN=ضع_هنا_توكن_البوت
CLIENT_ID=ضع_هنا_معرف_التطبيق_Application_ID
GUILD_ID=ضع_هنا_ايدي_السيرفر_لتحديث_الأوامر_فوراً
OWNER_ID=ضع_هنا_ايدي_حسابك_في_الديسكورد
```

### 4. تفعيل صلاحيات البوت (Intents) في Discord Portal:
تأكد من تفعيل الصلاحيات التالية في صفحة البوت (Bot -> Privileged Gateway Intents):
- ✅ **Presence Intent**
- ✅ **Server Members Intent**
- ✅ **Message Content Intent**

### 5. تسجيل أوامر السلاش (Slash Commands):
```bash
npm run deploy
```

### 6. تشغيل البوت:
```bash
npm start
```

---

## 📋 قائمة الأوامر المتاحة (Commands List)

| الأمر (Slash) | الوصف بالعربية | Description |
| :--- | :--- | :--- |
| `/ban` | حظر عضو من السيرفر | Ban a user from the server |
| `/unban` | إلغاء حظر عضو من السيرفر | Unban a user |
| `/kick` | طرد عضو من السيرفر | Kick a user from the server |
| `/mute` | إسكات عضو (28 يوم) | Mute a user (28 days) |
| `/unmute` | إزالة الإسكات عن عضو | Unmute a user |
| `/timeout` | إسكات عضو لفترة محددة | Timeout a user for a specific duration |
| `/untimeout` | إزالة الإسكات المؤقت عن عضو | Remove timeout from a user |
| `/vmute` | إسكات عضو في الكول | Voice mute a user |
| `/vunmute` | إزالة الإسكات الصوتي عن عضو | Voice unmute a user |
| `/warn` | تحذير عضو | Warn a user |
| `/warnings` | عرض تحذيرات عضو | View a user's warnings |
| `/clear-warnings` | مسح جميع تحذيرات عضو | Clear all warnings of a user |
| `/clear` | حذف عدد محدد من الرسائل | Delete a specified number of messages |
| `/role` | إضافة أو سحب رتبة من عضو | Add or remove a role from a user |
| `/lock` | قفل القناة الحالية | Lock the current channel |
| `/unlock` | فتح القناة الحالية | Unlock the current channel |
| `/hide` | إخفاء القناة الحالية عن الجميع | Hide current channel |
| `/unhide` | إظهار القناة الحالية للجميع | Unhide current channel |
| `/nuke` | مسح رسائل القناة بإعادة إنشائها | Clear all messages by recreating the channel |
| `/slowmode` | تحديد وضع التباطؤ للقناة | Set slowmode for the channel |
| `/protection toggle` | تشغيل/إيقاف حماية معينة | Toggle protection modules |
| `/protection status` | عرض حالة الحماية | View protection status |
| `/togglepro` | تفعيل/تعطيل الحماية الكاملة للمطورين | Toggle full protection (Devs only) |
| `/limit-settings set` | تعيين حد وعقوبة للإجراءات | Set limit and punishment for actions |
| `/limit-settings view` | عرض الإعدادات الحالية للحدود | View current limit punishment settings |
| `/whitelist grant role` | منح صلاحية لرتبة | Grant protection bypass to a role |
| `/whitelist grant user` | منح صلاحية لمستخدم | Grant protection bypass to a user |
| `/whitelist revoke role` | سحب صلاحية من رتبة | Revoke whitelist from a role |
| `/whitelist revoke user` | سحب صلاحية من مستخدم | Revoke whitelist from a user |
| `/whitelist view` | عرض صلاحيات الوايت ليست | View current whitelist |
| `/backup create` | إنشاء نسخة احتياطية | Create a server backup |
| `/backup info` | معلومات النسخة الاحتياطية | View backup information |
| `/backup restore` | استعادة النسخة الكاملة | Restore complete backup |
| `/backup restore-channels` | استعادة الإكشانلات فقط | Restore channels only |
| `/backup restore-roles` | استعادة الرولات فقط | Restore roles only |
| `/autoresponse add` | إضافة رد تلقائي جديد | Add a new auto response |
| `/autoresponse remove` | حذف رد تلقائي | Remove an auto response |
| `/autoresponse list` | عرض جميع الردود التلقائية | List all auto responses |
| `/autoresponse clear` | حذف جميع الردود التلقائية | Clear all auto responses |
| `/delivery` | إرسال رسالة تسليم طلب جديد | Send product delivery message |
| `/review` | إرسال رسالة التقييم | Submit customer review |
| `/setreviewchannel` | تعيين قناة التقييمات | Set dedicated review channel |
| `/announce` | إرسال إعلان احترافي | Send an announcement |
| `/serverinfo` | عرض معلومات السيرفر | Show server information |
| `/userinfo` | عرض معلومات المستخدم | Show user information |
| `/botinfo` | عرض معلومات البوت التقنية | Show bot technical information |
| `/membercount` | عرض عدد الأعضاء بالتفصيل | Show detailed member count |
| `/roles` | عرض قائمة رتب السيرفر | List server roles |
| `/emojis` | عرض قائمة إيموجيات السيرفر | List server emojis |
| `/avatar` | عرض صورة العضو | Show user avatar |
| `/banner` | عرض بنر العضو | Show user banner |
| `/ping` | سرعة استجابة البوت | Show bot latency |
| `/uptime` | مدة تشغيل البوت | Show bot uptime |
| `/invite` | رابط دعوة البوت | Bot invite link |
| `/join` | جعل البوت يدخل الروم الصوتي | Make the bot join a voice channel |
| `/leave` | جعل البوت يغادر الروم الصوتي | Make the bot leave voice channel |
| `/stay247` | بقاء البوت في الروم 24/7 | Toggle 24/7 voice channel presence |
| `/help` | قائمة الأوامر والشروحات | Show all commands help |

---

## 🛠️ الاستضافة على VPS أو بوتات ديسكورد سحابية:
- **Discloud / BotGhost / Render / Railway**: ببساطة ارفع الملفات واضبط المتغيرات في لوحة التحكم (Environment Variables) واكتب أمر البدء `npm start`.
- **سيرفر Ubuntu / VPS**:
  ```bash
  sudo apt update && sudo apt install nodejs npm -y
  sudo npm install -g pm2
  npm install
  npm run deploy
  pm2 start index.js --name "shield-bot"
  pm2 startup && pm2 save
  ```
