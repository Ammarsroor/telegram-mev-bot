import TelegramBot from "node-telegram-bot-api";

const token = process.env.BOT_TOKEN;

if (!token) {
  console.error("❌ BOT_TOKEN غير موجود");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// تخزين الحسابات الوهمية
const users = {};

// دالة توليد نسبة ربح عشوائية
function randomProfit() {
  return Math.floor(Math.random() * (100 - 4 + 1)) + 4;
}

// /start
bot.onText(/\/start/, (msg) => {
  const id = msg.chat.id;

  if (!users[id]) {
    users[id] = {
      balance: 50,
      trades: 0,
      profit: 0,
    };
  }

  bot.sendMessage(
    id,
    `🤖 أهلاً بك!
✅ الحساب التجريبي جاهز
💰 الرصيد: ${users[id].balance}$

الأوامر:
/buy - تنفيذ صفقة وهمية
/sell - إغلاق صفقة
/balance - عرض الرصيد
/status - حالة البوت
/help - المساعدة`
  );
});

// /help
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `🆘 الأوامر المتاحة:
/start - بدء البوت
/buy - شراء وهمي
/sell - بيع وهمي
/balance - الرصيد
/status - الحالة`
  );
});

// /status
bot.onText(/\/status/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `📡 الحالة:
🟢 البوت يعمل
⚙️ التداول: تجريبي
💰 رأس المال: وهمي`
  );
});

// /balance
bot.onText(/\/balance/, (msg) => {
  const id = msg.chat.id;
  if (!users[id]) return;

  bot.sendMessage(
    id,
    `💰 الرصيد الحالي: ${users[id].balance.toFixed(2)}$
📊 عدد الصفقات: ${users[id].trades}`
  );
});

// /buy
bot.onText(/\/buy/, (msg) => {
  const id = msg.chat.id;
  if (!users[id]) return;

  const tradeAmount = users[id].balance * 0.10; // 10%
  const profitPercent = randomProfit();
  const profit = (tradeAmount * profitPercent) / 100;

  users[id].balance += profit;
  users[id].profit += profit;
  users[id].trades++;

  bot.sendMessage(
    id,
    `🟢 صفقة شراء وهمية
💵 المبلغ: ${tradeAmount.toFixed(2)}$
📈 الربح: ${profitPercent}%
✅ الربح: ${profit.toFixed(2)}$`
  );
});

// /sell
bot.onText(/\/sell/, (msg) => {
  const id = msg.chat.id;
  if (!users[id]) return;

  bot.sendMessage(
    id,
    `🔴 تم إغلاق الصفقة
💰 الرصيد الجديد: ${users[id].balance.toFixed(2)}$`
  );
});

console.log("🤖 Trading Simulation Bot Started Successfully");
