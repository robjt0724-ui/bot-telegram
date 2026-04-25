const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

// GRUPOS
const grupoC = -1003906204677;
const grupoA = -1002110613167;
const grupoB = -1001831601806;

// MENSAGEM
const legenda = `🔥🎬 TEM FILME BOM TE ESPERANDO AGORA! 🍿✨

📲 Me chama no WhatsApp 👇
https://wa.link/e8t534`;

// FILA
let fila = [];

// CAPTURA IMAGENS
bot.on('message', (msg) => {
  if (msg.chat.id !== grupoC) return;

  if (msg.photo) {
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    fila.push(fileId);

    console.log("Imagem adicionada. Fila:", fila.length);
  }
});

// ENVIO A CADA 45 MIN
setInterval(async () => {
  if (fila.length === 0) return;

  const img = fila.shift();

  try {
    await bot.sendPhoto(grupoA, img, { caption: legenda });
    await bot.sendPhoto(grupoB, img, { caption: legenda });

    console.log("Enviado para A e B. Restante:", fila.length);
  } catch (err) {
    console.log("Erro:", err.message);
  }

}, 45 * 60 * 1000);

console.log("BOT FINAL RODANDO");
