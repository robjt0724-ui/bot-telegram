const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;

// força sem polling automático
const bot = new TelegramBot(token, {
  polling: false
});

console.log("BOT INICIADO SEM POLLING");
