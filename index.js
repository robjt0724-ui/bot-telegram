const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

// GRUPOS
const grupoC = -1003906204677;
const grupoA = -1002110613167;
const grupoB = -1001831601806;

// 🔥 MENSAGEM PADRÃO (NÃO ALTERAR FORMATAÇÃO)
const legendaPadrao = `🔥🎬 TEM FILME BOM TE ESPERANDO AGORA! 🍿✨

Aquele tipo de filme que te prende do começo ao fim 😱💥
Pode ser ação, comédia ou romance… o importante é que você não vai querer parar de assistir! 👀🔥

📲 Me chama no WhatsApp 👇💬

👇   CLIQUE AQUI EM BAIXO 👇

╔════════════════════════════╗
║  https://wa.link/e8t534    ║
╚════════════════════════════╝

🚀 Não perde tempo… só dar o play e curtir! 🎥🍿`;

// 📥 FILA DE IMAGENS
let fila = [];

// CAPTURA IMAGENS DO GRUPO C
bot.on('message', (msg) => {
  if (msg.chat.id !== grupoC) return;

  if (msg.photo) {
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    fila.push(fileId);

    console.log("Imagem adicionada na fila. Total:", fila.length);
  }
});

// ⏳ ENVIO AUTOMÁTICO (TESTE RÁPIDO 1 MINUTO)
setInterval(async () => {
  if (fila.length === 0) return;

  const imagem = fila.shift();

  try {
    await bot.sendPhoto(grupoA, imagem, { caption: legendaPadrao });
    await bot.sendPhoto(grupoB, imagem, { caption: legendaPadrao });

    console.log("Imagem enviada para A e B. Restante:", fila.length);
  } catch (err) {
    console.log("Erro ao enviar:", err.message);
  }

}, 1 * 60 * 1000);

console.log("BOT FINAL RODANDO");
