const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  console.log("==================================");
  console.log("NOME DO GRUPO:", msg.chat.title);
  console.log("ID DO GRUPO:", msg.chat.id);
  console.log("TIPO:", msg.chat.type);
  console.log("==================================");
});
