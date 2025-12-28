import TelegramBot from "node-telegram-bot-api";

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("❌ BOT_TOKEN not found");
    process.exit(1);
    }

    const bot = new TelegramBot(token, { polling: true });

    /* ======================
       PAPER TRADING ENGINE
       ====================== */

       let paperAccount = {
         balance: 50.0,
           positions: [],
             history: []
             };

             const TRADE_PERCENT = 0.10; // 10%
             const STOP_LOSS = 0.10;     // 10%

             function openTrade(symbol, price) {
               const tradeAmount = paperAccount.balance * TRADE_PERCENT;
                 if (tradeAmount < 1) return null;

                   const position = {
                       id: Date.now(),
                           symbol,
                               entry: price,
                                   amount: tradeAmount,
                                       sl: price * (1 - STOP_LOSS),
                                           openedAt: new Date().toLocaleTimeString()
                                             };

                                               paperAccount.balance -= tradeAmount;
                                                 paperAccount.positions.push(position);
                                                   return position;
                                                   }

                                                   function closeTrade(position, exitPrice) {
                                                     const pnlPercent = ((exitPrice - position.entry) / position.entry) * 100;
                                                       const pnl = position.amount * (pnlPercent / 100);

                                                         paperAccount.balance += position.amount + pnl;
                                                           paperAccount.positions = paperAccount.positions.filter(p => p.id !== position.id);

                                                             paperAccount.history.push({
                                                                 ...position,
                                                                     exit: exitPrice,
                                                                         pnlPercent: pnlPercent.toFixed(2),
                                                                             pnl: pnl.toFixed(2),
                                                                                 closedAt: new Date().toLocaleTimeString()
                                                                                   });

                                                                                     return pnlPercent;
                                                                                     }

                                                                                     /* ======================
                                                                                        TELEGRAM COMMANDS
                                                                                        ====================== */

                                                                                        bot.onText(/\/start/, (msg) => {
                                                                                          bot.sendMessage(
                                                                                              msg.chat.id,
                                                                                                  `🤖 أهلاً بك!

                                                                                                  ✅ البوت يعمل بنظام تداول تجريبي
                                                                                                  💰 الرصيد: $${paperAccount.balance.toFixed(2)}
                                                                                                  📊 حجم الصفقة: 10%
                                                                                                  🛑 وقف الخسارة: 10%

                                                                                                  استخدم /help لعرض الأوامر`
                                                                                                    );
                                                                                                    });

                                                                                                    bot.onText(/\/help/, (msg) => {
                                                                                                      bot.sendMessage(
                                                                                                          msg.chat.id,
                                                                                                          `🧠 أوامر البوت:
                                                                                                            
                                                                                                            /balance → الرصيد
                                                                                                            /positions → الصفقات المفتوحة
                                                                                                            /history → الصفقات المغلقة
                                                                                                            /buy ABC 0.0023 → صفقة وهمية
                                                                                                            /reset → إعادة الحساب`
                                                                                                              );
                                                                                                              });

                                                                                                              bot.onText(/\/balance/, (msg) => {
                                                                                                                bot.sendMessage(
                                                                                                                    msg.chat.id,
                                                                                                                        `💰 الرصيد الحالي: $${paperAccount.balance.toFixed(2)}`
                                                                                                                          );
                                                                                                                          });

                                                                                                                          bot.onText(/\/positions/, (msg) => {
                                                                                                                            if (paperAccount.positions.length === 0) {
                                                                                                                                return bot.sendMessage(msg.chat.id, "📭 لا توجد صفقات مفتوحة");
                                                                                                                                  }

                                                                                                                                    let text = "📊 الصفقات المفتوحة:\n\n";
                                                                                                                                      paperAccount.positions.forEach(p => {
                                                                                                                                          text += `🔹 ${p.symbol}
                                                                                                                                          Entry: ${p.entry}
                                                                                                                                          Amount: $${p.amount.toFixed(2)}
                                                                                                                                          SL: ${p.sl.toFixed(6)}\n\n`;
                                                                                                                                            });

                                                                                                                                              bot.sendMessage(msg.chat.id, text);
                                                                                                                                              });

                                                                                                                                              bot.onText(/\/history/, (msg) => {
                                                                                                                                                if (paperAccount.history.length === 0) {
                                                                                                                                                    return bot.sendMessage(msg.chat.id, "📭 لا توجد صفقات مغلقة");
                                                                                                                                                      }

                                                                                                                                                        let text = "📜 سجل الصفقات:\n\n";
                                                                                                                                                          paperAccount.history.slice(-5).forEach(h => {
                                                                                                                                                              text += `🔹 ${h.symbol}
                                                                                                                                                              PnL: ${h.pnlPercent}%
                                                                                                                                                              $${h.pnl}
                                                                                                                                                              Closed: ${h.closedAt}\n\n`;
                                                                                                                                                                });

                                                                                                                                                                  bot.sendMessage(msg.chat.id, text);
                                                                                                                                                                  });

                                                                                                                                                                  bot.onText(/\/buy (.+) ([0-9.]+)/, (msg, match) => {
                                                                                                                                                                    const symbol = match[1];
                                                                                                                                                                      const price = parseFloat(match[2]);

                                                                                                                                                                        const trade = openTrade(symbol, price);
                                                                                                                                                                          if (!trade) {
                                                                                                                                                                              return bot.sendMessage(msg.chat.id, "❌ الرصيد غير كافٍ");
                                                                                                                                                                                }

                                                                                                                                                                                  bot.sendMessage(
                                                                                                                                                                                      msg.chat.id,
                                                                                                                                                                                      `✅ صفقة وهمية فُتحت

                                                                                                                                                                                      🪙 ${symbol}
                                                                                                                                                                                      Entry: ${price}
                                                                                                                                                                                      Amount: $${trade.amount.toFixed(2)}
                                                                                                                                                                                      SL: ${trade.sl.toFixed(6)}

                                                                                                                                                                                      💰 Balance: $${paperAccount.balance.toFixed(2)}`
                                                                                                                                                                                        );
                                                                                                                                                                                        });

                                                                                                                                                                                        bot.onText(/\/reset/, (msg) => {
                                                                                                                                                                                          paperAccount = { balance: 50, positions: [], history: [] };
                                                                                                                                                                                            bot.sendMessage(msg.chat.id, "🔄 تم إعادة الحساب التجريبي إلى 50$");
                                                                                                                                                                                            });

                                                                                                                                                                                            console.log("🤖 Paper Trading Bot Started");