import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();

/* ================= CONFIG ================= */
const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("❌ BOT_TOKEN غير موجود");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

let balance = 50.0;
let stats = { total: 0, win: 0, loss: 0 };
let ADMIN_CHAT = null;

/* ================= PRICE SOURCES ================= */
async function fetchDexScreener() {
  try {
    const res = await fetch(
      "https://api.dexscreener.com/latest/dex/pairs/solana/So11111111111111111111111111111111111111112"
    );
    const data = await res.json();
    return parseFloat(data.pair.priceUsd);
  } catch {
    return null;
  }
}

async function fetchGeckoTerminal() {
  try {
    const res = await fetch(
      "https://api.geckoterminal.com/api/v2/simple/networks/solana/token_price/So11111111111111111111111111111111111111112"
    );
    const data = await res.json();
    return parseFloat(
      Object.values(data.data.attributes.token_prices)[0]
    );
  } catch {
    return null;
  }
}

async function fetchBirdeye() {
  try {
    const res = await fetch(
      "https://public-api.birdeye.so/public/price?address=So11111111111111111111111111111111111111112"
    );
    const data = await res.json();
    return data.data.value;
  } catch {
    return null;
  }
}

async function getRealPrice() {
  return (
    (await fetchDexScreener()) ||
    (await fetchGeckoTerminal()) ||
    (await fetchBirdeye())
  );
}

/* ================= PAPER TRADE ================= */
let lastPrice = null;

async function paperTrade() {
  const price = await getRealPrice();
  if (!price || !lastPrice) {
    lastPrice = price;
    return;
  }

  const change = (price - lastPrice) / lastPrice;
  lastPrice = price;

  const tradeAmount = balance * 0.10;
  const gas = 0.002;
  const fee = 0.02;

  const pnl = tradeAmount * change - gas - fee;
  balance += pnl;

  stats.total++;
  pnl >= 0 ? stats.win++ : stats.loss++;

  bot.sendMessage(
    ADMIN_CHAT,
`🔄 صفقة وهمية (بيانات حقيقية)
📈 السعر: ${price.toFixed(4)}$
📊 التغير: ${(change * 100).toFixed(2)}%
💵 المبلغ: ${tradeAmount.toFixed(2)}$
⛽ الغاز: ${gas}$
💸 الرسوم: ${fee}$
✅ الصافي: ${pnl.toFixed(2)}$
💰 الرصيد: ${balance.toFixed(2)}$`
  );
}

/* ================= COMMANDS ================= */
bot.onText(/\/start/, (msg) => {
  ADMIN_CHAT = msg.chat.id;
  bot.sendMessage(
    ADMIN_CHAT,
`🤖 Ammar MEV Bot
📡 مصادر:
• DexScreener
• GeckoTerminal
• Birdeye
💰 رصيد تجريبي: 50$`
  );
});

bot.onText(/\/status/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
`📊 الحالة:
💰 الرصيد: ${balance.toFixed(2)}$
📈 الصفقات: ${stats.total}`
  );
});

bot.onText(/\/stats/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
`📊 الإحصائيات:
✔ رابحة: ${stats.win}
❌ خاسرة: ${stats.loss}`
  );
});

/* ================= LOOP ================= */
setInterval(() => {
  if (ADMIN_CHAT) paperTrade();
}, 60000);

console.log("🤖 Phase B started successfully");
