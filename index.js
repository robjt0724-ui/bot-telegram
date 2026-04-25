const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  console.log(msg.chat.id);
});
