const TelegramBot = require('node-telegram-bot-api');

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

// CAPTURA IMAGENS (SEM ALTERAR NADA)
bot.on('message', (msg) => {
  if (msg.chat.id !== grupoC) return;

  if (msg.photo) {
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    fila.push(fileId);

    console.log("📥 imagem na fila:", fila.length);
  }
});

// ENVIO DIRETO (SEM SHARP, SEM CORTE, SEM DEFORMAÇÃO)
setInterval(async () => {
  if (fila.length === 0) return;

  const img = fila.shift();

  try {
    await bot.sendPhoto(grupoA, img, {
      caption: proximaMensagem(),
      ...botoes
    });

    await bot.sendPhoto(grupoB, img, {
      caption: proximaMensagem(),
      ...botoes
    });

    console.log("✅ enviada no formato original");
  } catch (err) {
    console.log("❌ erro:", err.message);
  }

}, 60 * 1000);

console.log("🚀 BOT RODANDO EM MODO IMAGEM ORIGINAL");
