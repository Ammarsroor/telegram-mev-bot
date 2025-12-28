    import TelegramBot from "node-telegram-bot-api";
  
  /* =======================
     الإعدادات الأساسية
     ======================= */
     const BOT_TOKEN = process.env.BOT_TOKEN;
     
     if (!BOT_TOKEN) {
       console.error("❌ BOT_TOKEN غير موجود");
         process.exit(1);
         }
         
         const bot = new TelegramBot(BOT_TOKEN, { polling: true });
         
         console.log("🤖 Telegram Bot Started Successfully");
         
         /* =======================
            حالة البوت
            ======================= */
            let botStatus = {
              mev: false,
                microExploits: false,
                  railway: true,
                  };
                  
                  /* =======================
                     أوامر البوت
                     ======================= */
                     
                     // START
                     bot.onText(/\/start/, (msg) => {
                       bot.sendMessage(
                           msg.chat.id,
                           `🤖 أهلاً بك!
                           
                           ✅ البوت يعمل بنجاح
                           📊 لوحة التحكم قيد التجهيز
                           ⚡ Micro‑Exploits سيتم تفعيلها لاحقًا بأمان`
                             );
                             });
                             
                             // HELP
                             bot.onText(/\/help/, (msg) => {
                               bot.sendMessage(
                                   msg.chat.id,
                                   `🆘 الأوامر المتاحة:
                                   /start - بدء البوت
                                   /help - المساعدة
                                   /status - حالة البوت
                                   /ping - اختبار الاتصال`
                                     );
                                     });
                                     
                                     // STATUS
                                     bot.onText(/\/status/, (msg) => {
                                       bot.sendMessage(
                                           msg.chat.id,
                                           `📡 الحالة الحالية:
                                           🟢 البوت يعمل
                                           ⚙️ Railway متصل
                                           🔐 التوكن آمن
                                           💠 MEV: ${botStatus.mev ? "مفعل" : "غير مفعل"}
                                           ⚡ Micro‑Exploits: ${botStatus.microExploits ? "مفعل" : "غير مفعل"}`
                                             );
                                             });
                                             
                                             // PING
                                             bot.onText(/\/ping/, (msg) => {
                                               bot.sendMessage(msg.chat.id, "🏓 Pong! البوت متصل ويعمل");
                                               });
                                               
                                               /* =======================
                                                  رد افتراضي لأي رسالة
                                                  ======================= */
                                                  bot.on("message", (msg) => {
                                                    if (!msg.text.startsWith("/")) {
                                                        bot.sendMessage(
                                                              msg.chat.id,
                                                                    "ℹ️ استخدم /help لرؤية الأوامر المتاحة"
                                                                        );
                                                                          }
                                                                          });                                    });