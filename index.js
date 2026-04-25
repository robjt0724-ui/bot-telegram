const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;

const bot = new TelegramBot(token, {
  polling: true
});

console.log("BOT INICIADO COM SUCESSO");

bot.on('message', (msg) => {
  console.log("Mensagem recebida:", msg.text || "[mídia]");
});
