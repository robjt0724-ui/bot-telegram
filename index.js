const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;

// NÃO inicia polling
const bot = new TelegramBot(token, { polling: false });

console.log("BOT EM MODO STOP (limpando sessão)");
