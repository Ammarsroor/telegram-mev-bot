import express from "express";
import TelegramBot from "node-telegram-bot-api";

const token = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;
const URL = process.env.PUBLIC_URL; // هذا الرابط سيرفر Railway

if (!token) {
  console.error("❌ BOT_TOKEN not found");
    process.exit(1);
    }
    
    const bot = new TelegramBot(token);
    const app = express();
    
    app.use(express.json());
    
    // Webhook endpoint
    app.post(`/bot${token}`, (req, res) => {
      bot.processUpdate(req.body);
        res.sendStatus(200);
        });
        
        // البوت يرد على أي رسالة
        bot.on("message", (msg) => {
          bot.sendMessage(
              msg.chat.id,
                  "✅ البوت يعمل بنجاح!\nهذا رد تجريبي مع Webhook."
                    );
                    });
                    
                    // ضبط Webhook
                    bot.setWebHook(`${URL}/bot${token}`);
                    
                    // Start Express server
                    app.listen(PORT, () => {
                      console.log(`🤖 Bot server running on port ${PORT}`);
                      });               });                                    });