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

// MENSAGENS (ROTATIVAS)
const mensagens = [
`🎬🍿 Tudo em um só lugar.
💰 R$35/mês
⏱️ Teste grátis
👉 Clique nos botões abaixo e saiba mais.`,

`🎬 Filmes e séries sem complicação.
💰 Apenas R$35 por mês
⏱️ Teste grátis por 3 horas
👉 Clique nos botões abaixo e saiba mais.`
];

// mensagem rotativa
function proximaMensagem() {
  const msg = mensagens[indexMsg];
  indexMsg = (indexMsg + 1) % mensagens.length;
  return msg;
}

// CAPTURA IMAGENS DO GRUPO C
bot.on('message', (msg) => {
  if (msg.chat.id !== grupoC) return;

  if (msg.photo) {
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    fila.push(fileId);

    console.log("📥 imagem na fila:", fila.length);
  }
});

// BAIXAR IMAGEM
async function baixarImagem(url) {
  const res = await axios({ url, responseType: 'arraybuffer' });
  return Buffer.from(res.data);
}

// 🖼️ PROCESSAMENTO FINAL (SEM CORTE + BORDAS 2X MAIORES)
async function processarImagem(buffer) {
  return await sharp(buffer)
    .resize(1000, 1413, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0 }
    })
    .extend({
      top: 200,
      bottom: 200,
      left: 150,
      right: 150,
      background: { r: 0, g: 0, b: 0 }
    })
    .jpeg({ quality: 90 })
    .toBuffer();
}

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

    // ENVIO GRUPO A
    await bot.sendPhoto(grupoA, tempPath, {
      caption: proximaMensagem(),
      ...botoes
    });

    // ENVIO GRUPO B
    await bot.sendPhoto(grupoB, tempPath, {
      caption: proximaMensagem(),
      ...botoes
    });

    fs.unlinkSync(tempPath);

    console.log("✅ enviado com bordas 2x e sem corte");

  } catch (err) {
    console.log("❌ erro:", err.message);
  }

}, 60 * 1000);

console.log("🚀 BOT FINAL RODANDO (SEM CORTE + BORDAS 2X + FILA)");
