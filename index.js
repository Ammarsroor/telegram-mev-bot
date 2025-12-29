import TelegramBot from "node-telegram-bot-api";

const token = process.env.BOT_TOKEN;

if (!token) {
  console.error("❌ BOT_TOKEN غير موجود");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// ====== بيانات وهمية ======
let balance = 50; // رصيد وهمي
let openTrades = [];

// ====== أدوات ======
function randomProfit() {
  return Math.floor(Math.random() * (100 - 4 + 1)) + 4; // 4% → 100%
}

// ====== الأوامر ======
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    bot.sendMessage(
      chatId,
      `🤖 أهلاً بك\n\n💰 رصيد تجريبي: $${balance}\n📊 وضع تجريبي مفعل`
    );
  }

  else if (text === "/help") {
    bot.sendMessage(
      chatId,
      `🆘 الأوامر:\n/balance عرض الرصيد\n/buy فتح صفقة\n/sell إغلاق صفقة\n/reset إعادة الرصيد`
    );
  }

  else if (text === "/status") {
    bot.sendMessage(
      chatId,
      `📡 الحالة:\n🟢 البوت يعمل\n📈 صفقات مفتوحة: ${openTrades.length}`
    );
  }

  else if (text === "/balance") {
    bot.sendMessage(chatId, `💰 رصيدك الحالي: $${balance.toFixed(2)}`);
  }

  else if (text === "/buy") {
    const tradeAmount = balance * 0.10;

    if (tradeAmount < 1) {
      bot.sendMessage(chatId, "⚠️ الرصيد غير كافٍ لفتح صفقة");
      return;
    }

    balance -= tradeAmount;

    const trade = {
      amount: tradeAmount,
      profitPercent: randomProfit()
    };

    openTrades.push(trade);

    bot.sendMessage(
      chatId,
      `🟢 تم فتح صفقة\n💵 المبلغ: $${tradeAmount.toFixed(2)}\n🎯 هدف الربح: ${trade.profitPercent}%`
    );
  }

  else if (text === "/sell") {
    if (openTrades.length === 0) {
      bot.sendMessage(chatId, "❌ لا توجد صفقات مفتوحة");
      return;
    }

    const trade = openTrades.shift();
    const profit = trade.amount * (trade.profitPercent / 100);
    const total = trade.amount + profit;

    balance += total;

    bot.sendMessage(
      chatId,
      `🔴 تم إغلاق الصفقة\n📈 ربح: $${profit.toFixed(2)} (${trade.profitPercent}%)\n💰 الرصيد الآن: $${balance.toFixed(2)}`
    );
  }

  else if (text === "/reset") {
    balance = 50;
    openTrades = [];
    bot.sendMessage(chatId, "♻️ تم إعادة الحساب التجريبي إلى $50");
  }
});

console.log("🤖 Trading Simulation Bot Started");
