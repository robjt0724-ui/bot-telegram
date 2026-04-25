const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;

// cria bot
const bot = new TelegramBot(token, {
  polling: {
    autoStart: false
  }
});

// reinicia polling limpo
bot.stopPolling().then(() => {
  bot.startPolling();
});
