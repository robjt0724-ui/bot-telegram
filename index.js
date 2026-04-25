const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

// GRUPOS
const grupoC = -1003906204677;
const grupoA = -1002110613167;
const grupoB = -1001831601806;

// MENSAGEM PADRÃO
const legendaPadrao = `🔥🎬 TEM FILME BOM TE ESPERANDO AGORA! 🍿✨

Aquele tipo de filme que te prende do começo ao fim 😱💥

📲 Quer assistir agora? Me chama no WhatsApp 👇💬

https://wa.link/e8t534`;

// FILA DE IMAGENS
let fila = [];

// CAPTURA DO GRUPO C
bot.on('message', (msg) => {
  if (msg.chat.id !== grupoC) return;

  if (msg.photo) {
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    fila.push(fileId);
  }
});

// ENVIO A CADA 45 MINUTOS
setInterval(async () => {
  if (fila.length === 0) return;

  const imagem = fila.shift();

  try {
    await bot.sendPhoto(grupoA, imagem, { caption: legendaPadrao });
    await bot.sendPhoto(grupoB, imagem, { caption: legendaPadrao });

    console.log("Enviado para A e B");
  } catch (err) {
    console.log("Erro:", err.message);
  }

}, 45 * 60 * 1000);
