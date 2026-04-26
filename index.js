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

// 🔥 MENSAGENS VARIADAS (ALEATÓRIAS)
const mensagens = [
`🎬🍿 Tem gente pagando vários apps sem nem usar direito…
Aqui você resolve tudo em um só lugar, com filmes e séries sem complicação.

💰 Só R$35 por mês
⏱️ Teste grátis por 3 horas

👉 Clique nos botões abaixo e saiba mais.`,

`🎬 Você ainda fica procurando filme e não acha nada bom?
Aqui já tá tudo pronto pra assistir.

💰 Acesso por R$35/mês
⏱️ Teste grátis de 3 horas

👉 Clique nos botões abaixo e saiba mais.`,

`🍿 Chega de pular de app em app sem achar nada…
Aqui você tem tudo em um só lugar.

💰 R$35 por mês
⏱️ 3 horas grátis pra testar

👉 Clique nos botões abaixo e saiba mais.`,

`🎬 Isso aqui ainda é pouco conhecido…
Mas quem usa não larga mais.

💰 Só R$35/mês
⏱️ Teste grátis por 3 horas

👉 Clique nos botões abaixo e saiba mais.`
];

// 🎲 PEGAR MENSAGEM ALEATÓRIA
function mensagemAleatoria() {
  return mensagens[Math.floor(Math.random() * mensagens.length)];
}

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

// CAPTURA IMAGENS
bot.on('message', (msg) => {
  if (msg.chat.id !== grupoC) return;

  if (msg.photo) {
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    fila.push(fileId);

    console.log("📥 fila:", fila.length);
  }
});

// BAIXAR IMAGEM
async function baixarImagem(url) {
  const res = await axios({ url, responseType: 'arraybuffer' });
  return Buffer.from(res.data);
}

// 🖼️ IMAGEM 1000x1413 + BORDAS (SEM CORTAR)
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

// ⏱️ ENVIO A CADA 45 MINUTOS
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

    const texto = mensagemAleatoria();

    await bot.sendPhoto(grupoA, tempPath, {
      caption: texto,
      ...botoes
    });

    await bot.sendPhoto(grupoB, tempPath, {
      caption: texto,
      ...botoes
    });

    fs.unlinkSync(tempPath);

    console.log("✅ enviado com sucesso (45 min + aleatório)");

  } catch (err) {
    console.log("❌ erro:", err.message);
  }

}, 45 * 60 * 1000); // ⏱️ 45 minutos

console.log("🚀 BOT RODANDO: 45 MIN + MENSAGENS ALEATÓRIAS + IMAGEM PROFISSIONAL");
