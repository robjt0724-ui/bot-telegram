const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

// ================== GRUPOS ==================
const grupoC = -1003906204677;
const grupoA = -1002110613167;
const grupoB = -1001831601806;

// ================== ESTADO GLOBAL ==================
let fila = [];
let pausado = false;
let intervaloMinutos = 45;
let enviados = 0;

// ================== PERSISTÊNCIA SIMPLES ==================
const filaFile = "fila.json";

function salvarFila() {
  fs.writeFileSync(filaFile, JSON.stringify(fila));
}

function carregarFila() {
  if (fs.existsSync(filaFile)) {
    fila = JSON.parse(fs.readFileSync(filaFile));
  }
}

carregarFila();

// ================== MENSAGENS ==================
const mensagens = [
`🎬🍿 Tem gente pagando vários apps sem nem usar direito… 😑
Aqui você resolve tudo em um só lugar 🔥

💰 Só R$35 por mês
⏱️ Teste grátis 3 horas`,

`🎬 Você ainda fica procurando filme e não acha nada bom? 😑
Aqui já tá tudo pronto pra assistir 🔥

💰 R$35/mês
⏱️ Teste grátis 3h`,

`🍿 Chega de pular de app em app… 😤
Aqui é tudo em um só lugar 🔥

💰 R$35/mês
⏱️ Teste grátis 3h`,

`🎬 Isso aqui poucos conhecem… 👀
Mas quem usa não larga 🔥

💰 R$35/mês
⏱️ Teste grátis`
];

function msgAleatoria() {
  return mensagens[Math.floor(Math.random() * mensagens.length)];
}

// ================== BOTÕES ==================
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

// ================== PAINEL DE CONTROLE ==================
bot.onText(/\/pause/, (msg) => {
  pausado = true;
  bot.sendMessage(msg.chat.id, "⏸️ Bot pausado");
});

bot.onText(/\/resume/, (msg) => {
  pausado = false;
  bot.sendMessage(msg.chat.id, "▶️ Bot retomado");
});

bot.onText(/\/status/, (msg) => {
  bot.sendMessage(msg.chat.id,
`📊 STATUS

⏸️ Pausado: ${pausado}
⏱️ Intervalo: ${intervaloMinutos} min
📥 Fila: ${fila.length}
📤 Enviados: ${enviados}`);
});

bot.onText(/\/fila/, (msg) => {
  bot.sendMessage(msg.chat.id, `📥 Itens na fila: ${fila.length}`);
});

bot.onText(/\/settime (\d+)/, (msg, match) => {
  intervaloMinutos = parseInt(match[1]);
  bot.sendMessage(msg.chat.id, `⏱️ Novo intervalo: ${intervaloMinutos} minutos`);
});

// ================== CAPTURA ==================
bot.on('message', (msg) => {
  if (msg.chat.id !== grupoC) return;

  if (msg.photo) {
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    fila.push(fileId);
    salvarFila();
    console.log("📥 fila:", fila.length);
  }
});

// ================== IMAGEM PROFISSIONAL ==================
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

// ================== LOOP DINÂMICO ==================
async function loop() {
  if (!pausado && fila.length > 0) {
    const fileId = fila.shift();
    salvarFila();

    try {
      const file = await bot.getFile(fileId);
      const url = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

      const res = await axios({ url, responseType: 'arraybuffer' });
      const buffer = Buffer.from(res.data);

      const finalImage = await processarImagem(buffer);

      const temp = path.join(__dirname, "temp.jpg");
      fs.writeFileSync(temp, finalImage);

      const texto = msgAleatoria();

      await bot.sendPhoto(grupoA, temp, {
        caption: texto,
        ...botoes
      });

      await bot.sendPhoto(grupoB, temp, {
        caption: texto,
        ...botoes
      });

      fs.unlinkSync(temp);

      enviados++;
      console.log("✅ enviado:", enviados);

    } catch (err) {
      console.log("❌ erro:", err.message);
    }
  }

  setTimeout(loop, intervaloMinutos * 60 * 1000);
}

loop();

console.log("🚀 BOT PROFISSIONAL RODANDO COM CONTROLE TOTAL");
