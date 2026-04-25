const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

// COLE SEUS IDs AQUI
const grupoA = -1002110613167;
const grupoB = -1001831601806;

bot.on('message', (msg) => {
  if (msg.chat.id === grupoA) {
    bot.forwardMessage(grupoB, grupoA, msg.message_id);
  }
});
