const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

// GRUPOS
const grupoC = -1003906204677;
const grupoA = -1002110613167;
const grupoB = -1001831601806;

// FILA
let fila = [];
let indexMsg = 0;

// BOTÕES
const botoes = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: "👉 VER AGORA 🔥", url: "https://wa.link/e8t534" },
        { text: "🎁 TESTE GRÁTIS", url: "https://wa.link/e8t534" }
      ]
    ]
  }
};

// MENSAGENS
const mensagens = [
`🎬🍿 Tudo em um só lugar.
💰 R$35/mês
⏱️ Teste grátis
👉 Clique nos botões abaixo e saiba mais.`
];

// ROTATIVO
function proximaMensagem() {
  const msg = mensagens[indexMsg];
  indexMsg = (indexMsg + 1) % mensagens.length;
  return msg;
}

// BAIXAR IMAGEM
async function baixarImagem(url) {
  const res = await axios({ url, responseType: 'arraybuffer' });
  return Buffer.from(res.data);
}

// ✨ IMAGEM PROFISSIONAL 1000x1413 COM BORDAS (SEM CORTAR)
async function processarImagem(buffer) {
  return await sharp(buffer)
    .resize(1000, 1413, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0 } // borda preta
    })
    .jpeg({ quality: 90 })
    .toBuffer();
}

// CAPTURA IMAGENS
bot.on('message', (msg) => {
  if (msg.chat.id !== grupoC) return;

  if (msg.photo) {
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    fila.push(fileId);

    console.log("📥 fila:", fila.length);
  }
});

// ENVIO AUTOMÁTICO
setInterval(async () => {
  if (fila.length === 0) return;

  const fileId = fila.shift();

  try {
    const file = await bot.getFile(fileId);
    const url = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

    const original = await baixarImagem(url);
    const finalImage = await processarImagem(original);

    const tempPath = path.join(__dirname, "temp.jpg");
    fs.writeFileSync(tempPath, finalImage);

    await bot.sendPhoto(grupoA, tempPath, {
      caption: proximaMensagem(),
      ...botoes
    });

    await bot.sendPhoto(grupoB, tempPath, {
      caption: proximaMensagem(),
      ...botoes
    });

    fs.unlinkSync(tempPath);

    console.log("✅ enviada 1000x1413 com borda");

  } catch (err) {
    console.log("❌ erro:", err.message);
  }

}, 60 * 1000);

console.log("🚀 BOT PROFISSIONAL 1000x1413 RODANDO");
