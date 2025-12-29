import TelegramBot from "node-telegram-bot-api";

/* ================== CONFIG ================== */
const BOT_TOKEN = process.env.BOT_TOKEN || "PUT_YOUR_BOT_TOKEN_HERE";
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

/* ============== PAPER ACCOUNT =============== */
let account = {
  balance: 50,
  startBalance: 50,
  wins: 0,
  losses: 0,
  trades: 0,
  maxDrawdown: 0,
  openTrades: [],
  cooldown: false,
};

/* ============== STRATEGY CONFIG ============== */
const CONFIG = {
  tradePercent: 0.1,
  minTrade: 3,
  maxTrade: 6,
  tp: [0.04, 0.08, 0.15],
  sl: -0.05,
  hardSl: -0.07,
  maxTradesPerHour: 3,
  maxOpenTrades: 2,
};

/* ============== UTILS ================== */
function random(min, max) {
  return Math.random() * (max - min) + min;
}

/* ============== FAKE MARKET DATA ================== */
function getFakeMarket() {
  return {
    priceChange5m: random(-30, 40),
    liquidity: random(10000, 80000),
    volume5m: random(5000, 50000),
  };
}

/* ============== ENTRY CHECK ================== */
function canEnter(m) {
  let score = 0;
  if (m.priceChange5m >= 2) score++;
  if (m.liquidity >= 30000) score++;
  if (m.volume5m >= 10000) score++;
  return score >= 2;
}

/* ============== EXECUTE PAPER TRADE ================== */
function executeTrade(chatId) {
  if (account.cooldown) return;

  if (account.openTrades.length >= CONFIG.maxOpenTrades) return;

  const market = getFakeMarket();
  if (!canEnter(market)) return;

  let size = Math.min(
    Math.max(account.balance * CONFIG.tradePercent, CONFIG.minTrade),
    CONFIG.maxTrade
  );

  const priceMove = random(-0.35, 0.35); // -35% to +35%
  const gas = random(0.002, 0.005);
  const fee = size * 0.003;

  let profit = size * priceMove - gas - fee;
  account.balance += profit;
  account.trades++;

  if (profit > 0) account.wins++;
  else account.losses++;

  const drawdown = account.startBalance - account.balance;
  if (drawdown > account.maxDrawdown) account.maxDrawdown = drawdown;

  if (account.losses >= 2 && profit < 0) {
    account.cooldown = true;
    setTimeout(() => (account.cooldown = false), 15 * 60 * 1000);
  }

  bot.sendMessage(
    chatId,
    `🔄 صفقة وهمية تلقائية\n\n` +
      `💵 المبلغ: ${size.toFixed(2)}$\n` +
      `📊 فرق السعر: ${(priceMove * 100).toFixed(2)}%\n` +
      `⛽ غاز: ${gas.toFixed(3)}$\n` +
      `💸 رسوم: ${fee.toFixed(3)}$\n` +
      `✅ الصافي: ${profit.toFixed(2)}$\n` +
      `💰 الرصيد: ${account.balance.toFixed(2)}$`
  );
}

/* ============== TELEGRAM COMMANDS ================== */

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `🤖 Ammar MEV Bot (Paper Trading)\n\n` +
      `الأوامر:\n` +
      `/status – حالة الحساب\n` +
      `/run – تشغيل البوت\n` +
      `/stop – إيقاف البوت`,
    {
      reply_markup: {
        keyboard: [
          [{ text: "▶ تشغيل" }, { text: "⏹ إيقاف" }],
          [{ text: "📊 الحالة" }],
        ],
        resize_keyboard: true,
      },
    }
  );
});

let interval = null;

bot.onText(/\/run|▶ تشغيل/, (msg) => {
  if (interval) return;
  interval = setInterval(() => executeTrade(msg.chat.id), 20000);
  bot.sendMessage(msg.chat.id, "✅ تم تشغيل البوت (Paper Trading)");
});

bot.onText(/\/stop|⏹ إيقاف/, (msg) => {
  clearInterval(interval);
  interval = null;
  bot.sendMessage(msg.chat.id, "⛔ تم إيقاف البوت");
});

bot.onText(/\/status|📊 الحالة/, (msg) => {
  const winRate =
    account.trades > 0
      ? ((account.wins / account.trades) * 100).toFixed(2)
      : 0;

  bot.sendMessage(
    msg.chat.id,
    `📊 حالة الحساب\n\n` +
      `💰 الرصيد: ${account.balance.toFixed(2)}$\n` +
      `📈 الصفقات: ${account.trades}\n` +
      `✅ أرباح: ${account.wins}\n` +
      `❌ خسائر: ${account.losses}\n` +
      `🎯 Win Rate: ${winRate}%\n` +
      `📉 Max Drawdown: ${account.maxDrawdown.toFixed(2)}$`
  );
});
