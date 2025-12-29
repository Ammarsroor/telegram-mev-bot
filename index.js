import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/* ================== CONFIG ================== */
const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

let MODE = "PAPER";
let balance = 50.0;
let startBalance = 50.0;
let tradeSizePercent = 0.10;
let maxLossPercent = 0.20;

let stats = {
  total: 0,
  win: 0,
  loss: 0,
};

let running = true;

/* ================== UTILS ================== */
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const gasFee = 0.002;
const tradeFee = 0.015;
const openFee = 0.20;

/* ================== DATA SOURCES ================== */
async function fetchDexPairs() {
  try {
    const res = await axios.get(
      "https://api.dexscreener.com/latest/dex/search?q=SOL"
    );
    return res.data.pairs || [];
  } catch {
    return [];
  }
}

/* ================== SCAM FILTER ================== */
function isSafeToken(pair) {
  if (!pair.liquidity || pair.liquidity.usd < 5000) return false;
  if (pair.fdv && pair.fdv < 50000) return false;
  if (!pair.baseToken || !pair.quoteToken) return false;
  return true;
}

/* ================== INDICATORS ================== */
function indicators(pair) {
  let score = 0;

  // 1 Volume Spike
  if (pair.volume.h24 > 50000) score++;

  // 2 Price Change
  if (pair.priceChange.h1 > 5) score++;

  // 3 Momentum
  if (pair.priceChange.m5 > pair.priceChange.h1 * 0.2) score++;

  // 4 Liquidity Ratio
  if (pair.liquidity.usd / pair.fdv > 0.05) score++;

  // 5 RSI proxy
  if (pair.priceChange.m5 > 0 && pair.priceChange.h1 > 0) score++;

  // 6 Buy pressure
  if (pair.txns.h1.buys > pair.txns.h1.sells) score++;

  // 7 MarketCap velocity
  if (pair.priceChange.h24 > 10) score++;

  return score;
}

/* ================== TRADE ENGINE ================== */
async function simulateTrade(pair) {
  if (!running) return;
  if (balance <= startBalance * (1 - maxLossPercent)) {
    running = false;
    bot.sendMessage(
      ADMIN_CHAT,
      "⛔ تم إيقاف البوت: خسارة 20% من رأس المال"
    );
    return;
  }

  const tradeAmount = balance * tradeSizePercent;
  const change = pair.priceChange.h1 / 100;
  const pnl = tradeAmount * change - gasFee - tradeFee - openFee;

  balance += pnl;
  stats.total++;

  if (pnl > 0) stats.win++;
  else stats.loss++;

  bot.sendMessage(
    ADMIN_CHAT,
`🔄 صفقة وهمية تلقائية
💵 المبلغ: ${tradeAmount.toFixed(2)}$
📊 فرق السعر: ${(change * 100).toFixed(2)}%
⛽ غاز: ${gasFee}$
💸 رسوم: ${tradeFee + openFee}$
✅ الصافي: ${pnl.toFixed(2)}$
💰 الرصيد: ${balance.toFixed(2)}$`
  );
}

/* ================== MARKET SCANNER ================== */
async function scanMarket() {
  const pairs = await fetchDexPairs();

  for (const pair of pairs) {
    if (!isSafeToken(pair)) continue;

    const score = indicators(pair);
    if (score >= 5) {
      await simulateTrade(pair);
      await sleep(2000);
    }
  }
}

/* ================== TELEGRAM COMMANDS ================== */
let ADMIN_CHAT = null;

bot.onText(/\/start/, (msg) => {
  ADMIN_CHAT = msg.chat.id;
  bot.sendMessage(
    ADMIN_CHAT,
    "🤖 Ammar MEV Bot يعمل\n📊 الوضع: Paper Trading\n⏱ فحص السوق كل 60 ثانية"
  );
});

bot.onText(/\/status/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
`📡 الحالة:
🟢 يعمل
💰 الرصيد: ${balance.toFixed(2)}$
📊 الصفقات: ${stats.total}`
  );
});

bot.onText(/\/stats/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
`📊 الإحصائيات:
✔ رابحة: ${stats.win}
❌ خاسرة: ${stats.loss}
📈 Win Rate: ${
      stats.total ? ((stats.win / stats.total) * 100).toFixed(2) : 0
    }%`
  );
});

/* ================== LOOP ================== */
setInterval(scanMarket, 60000);

console.log("🤖 Bot started successfully");
