const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

// GRUPOS
const grupoC = -1003906204677;
const grupoA = -1002110613167;
const grupoB = -1001831601806;

// MENSAGEM
const legendaPadrao = `🔥🎬 TEM FILME BOM TE ESPERANDO AGORA! 🍿✨

Aquele tipo de filme que te prende do começo ao fim 😱💥
Pode ser ação, comédia ou romance… o importante é que você não vai querer parar de assistir! 👀🔥

📲 Quer assistir agora? Me chama no WhatsApp 👇💬

👇   CLIQUE AQUI EM BAIXO 👇

╔════════════════════════════╗
║ https://wa.link/e8t534 ║
╚════════════════════════════╝

🚀 Não perde tempo… só dar o play e curtir! 🎥🍿`;

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

}, 1 * 60 * 1000);

console.log("BOT FINAL RODANDO");
