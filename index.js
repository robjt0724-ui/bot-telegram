const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

// GRUPOS
const grupoC = -1003906204677;
const grupoA = -1002110613167;
const grupoB = -1001831601806;

// 📥 FILA
let fila = [];
let indexMsg = 0;

// 🔘 BOTÕES
const botoes = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "👉 VER AGORA 🔥",
          url: "https://wa.link/e8t534"
        },
        {
          text: "🎁 TESTE GRÁTIS",
          url: "https://wa.link/e8t534"
        }
      ]
    ]
  }
};

// 🔁 MENSAGENS
const mensagens = [
`🎬🍿 Tem gente pagando vários apps sem nem usar direito…
Aqui você resolve tudo em um só lugar, com filmes e séries sem complicação.

💰 Apenas R$35 por mês
⏱️ Teste grátis por 3 horas

👉 Clique nos botões abaixo e saiba mais.`,

`🎬 Você ainda perde tempo procurando filme e não acha nada bom?
Aqui já está tudo pronto pra assistir.

💰 R$35/mês
⏱️ Teste grátis de 3 horas

👉 Clique nos botões abaixo e saiba mais.`,

`🍿 Chega de pular de app em app sem resultado.
Aqui você tem tudo em um só lugar.

💰 R$35 por mês
⏱️ 3 horas grátis

👉 Clique nos botões abaixo e saiba mais.`,

`🎬 Isso ainda é pouco conhecido…
Mas quem usa não troca mais.

💰 Apenas R$35/mês
⏱️ Teste grátis por 3 horas

👉 Clique nos botões abaixo e saiba mais.`
];

// 🔁 ROTATIVO
function proximaMensagem() {
  const msg = mensagens[indexMsg];
  indexMsg = (indexMsg + 1) % mensagens.length;
  return msg;
}

// 📥 CAPTURA IMAGENS
bot.on('message', (msg) => {
  if (msg.chat.id !== grupoC) return;

  if (msg.photo) {
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    fila.push(fileId);

    console.log("📥 Imagem na fila:", fila.length);
  }
});

// ⏳ ENVIO AUTOMÁTICO (DOCUMENTO = ORIGINAL SEM COMPRESSÃO)
setInterval(async () => {
  if (fila.length === 0) return;

  const img = fila.shift();

  try {
    // GRUPO A
    await bot.sendDocument(grupoA, img, {
      caption: proximaMensagem(),
      ...botoes
    });

    // GRUPO B
    await bot.sendDocument(grupoB, img, {
      caption: proximaMensagem(),
      ...botoes
    });

    console.log("✅ Enviado como DOCUMENTO. Fila:", fila.length);
  } catch (err) {
    console.log("❌ Erro:", err.message);
  }

}, 60 * 1000);

console.log("🚀 BOT RODANDO EM MODO DOCUMENTO (QUALIDADE ORIGINAL)");
