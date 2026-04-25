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

// CAPTURA IMAGENS DO GRUPO C
bot.on('message', (msg) => {
  if (msg.chat.id !== grupoC) return;

  // captura foto
  if (msg.photo) {
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    fila.push(fileId);

    console.log("Imagem adicionada na fila. Total:", fila.length);
  }
});

// ENVIO AUTOMÁTICO A CADA 45 MINUTOS
setInterval(async () => {
  if (fila.length === 0) {
    console.log("Fila vazia...");
    return;
  }

  const imagem = fila.shift();

  try {
    await bot.sendPhoto(grupoA, imagem, { caption: legendaPadrao });
    await bot.sendPhoto(grupoB, imagem, { caption: legendaPadrao });

    console.log("Imagem enviada para Grupo A e B. Restante na fila:", fila.length);
  } catch (err) {
    console.log("Erro ao enviar:", err.message);
  }

}, 45 * 60 * 1000);

console.log("Bot iniciado com sucesso...");
