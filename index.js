const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');

const token = process.env.BOT_TOKEN;
const url = process.env.RAILWAY_URL; // الرابط العام لمشروعك على Railway
const port = process.env.PORT || 3000;

if (!token || !url) {
  console.error("❌ BOT_TOKEN أو RAILWAY_URL غير موجود");
    process.exit(1);
    }

    const bot = new TelegramBot(token);
    bot.setWebHook(`${url}/bot${token}`);

    const app = express();
    app.use(bodyParser.json());
    app.post(`/bot${token}`, (req, res) => {
      bot.processUpdate(req.body);
        res.sendStatus(200);
        });

        // إضافة مثال لرد تجريبي
        bot.on('message', (msg) => {
          bot.sendMessage(msg.chat.id, "✅ البوت يعمل بنجاح!\nهذا رد تجريبي.");
          });

          app.listen(port, () => {
            console.log(`🤖 البوت يعمل على المنفذ ${port}`);
            });