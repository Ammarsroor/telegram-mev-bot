import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

/* ====== إعدادات المحاكاة ====== */
const START_BALANCE = 50;
const TRADE_PERCENT = 0.10; // 10% من الرصيد
const FEE_PERCENT = 0.003; // 0.3% رسوم
const GAS_FEE = 0.002; // غاز وهمي
const TRADE_INTERVAL = 15000; // كل 15 ثانية

/* ====== التخزين ====== */
const users = {};

/* ====== أدوات ====== */
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function fakeDexPrice() {
  return randomBetween(0.8, 1.2); // محاكاة تغير السعر
}

/* ====== بدء البوت ====== */
bot.onText(/\/start/, (msg) => {
  const id = msg.chat.id;

  if (!users[id]) {
    users[id] = {
      balance: START_BALANCE,
      trades: 0,
      running: true,
    };

    startAutoTrading(id);
  }

  bot.sendMessage(
    id,
    `🤖 تم تشغيل التداول الوهمي تلقائيًا

💰 الرصيد: ${users[id].balance.toFixed(2)}$
📈 الصفقات: تلقائية
⛽ الغاز: محاكاة
🧠 الأسعار: محاكاة DexScreener`
  );
});

/* ====== حالة ====== */
bot.onText(/\/status/, (msg) => {
  const u = users[msg.chat.id];
  if (!u) return;

  bot.sendMessage(
    msg.chat.id,
    `📊 الحالة:
💰 الرصيد: ${u.balance.toFixed(2)}$
📈 عدد الصفقات: ${u.trades}
🤖 التداول: تلقائي`
  );
});

/* ====== التداول التلقائي ====== */
function startAutoTrading(chatId) {
  setInterval(() => {
    const user = users[chatId];
    if (!user || !user.running) return;
    if (user.balance <= 1) return;

    const tradeAmount = user.balance * TRADE_PERCENT;
    const entryPrice = fakeDexPrice();
    const exitPrice = fakeDexPrice();

    const priceChange = (exitPrice - entryPrice) / entryPrice;
    const profit = tradeAmount * priceChange;

    const fee = tradeAmount * FEE_PERCENT;
    const net = profit - fee - GAS_FEE;

    user.balance += net;
    user.trades++;

    bot.sendMessage(
      chatId,
      `🔄 صفقة وهمية تلقائية
💵 المبلغ: ${tradeAmount.toFixed(2)}$
📊 فرق السعر: ${(priceChange * 100).toFixed(2)}%
⛽ غاز: ${GAS_FEE}$
💸 رسوم: ${fee.toFixed(3)}$
✅ الصافي: ${net.toFixed(2)}$
💰 الرصيد: ${user.balance.toFixed(2)}$`
    );
  }, TRADE_INTERVAL);
}

console.log("🤖 Auto Trading Simulation Bot Running");
