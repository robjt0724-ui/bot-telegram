const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

// GRUPOS
const grupoC = -1003906204677;
const grupoA = -1002110613167;
const grupoB = -1001831601806;

// 🔥 ESTADO DO SISTEMA
let fila = [];
let pausado = false;
let enviadosHoje = 0;

// 🔥 MENSAGEM
const legendaPadrao = `🔥🎬 TEM FILME BOM TE ESPERANDO AGORA! 🍿✨

Aquele tipo de filme que te prende do começo ao fim 😱💥
Pode ser ação, comédia ou romance…

🚀 Não perde tempo, só dar o play! 🎥🍿`;

// 🔘 BOTÃO WHATSAPP
const botoes = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "📲 Assistir no WhatsApp",
          url: "https://wa.link/e8t534"
        }
      ]
    ]
  }
};

// 📥 CAPTURA IMAGENS
bot.on('message', (msg) => {
  if (msg.chat.id !== grupoC) return;

  if (msg.photo) {
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    fila.push(fileId);

    console.log("Fila:", fila.length);
  }
});

// ⏳ ENVIO AUTOMÁTICO
setInterval(async () => {
  if (pausado) return;
  if (fila.length === 0) return;

  const img = fila.shift();

  try {
    await bot.sendPhoto(grupoA, img, {
      caption: legendaPadrao,
      ...botoes
    });

    await bot.sendPhoto(grupoB, img, {
      caption: legendaPadrao,
      ...botoes
    });

    enviadosHoje++;

    console.log("Enviado. Fila:", fila.length);
  } catch (err) {
    console.log("Erro:", err.message);
  }

}, 1 * 60 * 1000);

// ============================
// 🧠 PAINEL DE CONTROLE
// ============================

bot.onText(/\/pause/, (msg) => {
  pausado = true;
  bot.sendMessage(msg.chat.id, "⏸️ Envio PAUSADO");
});

bot.onText(/\/resume/, (msg) => {
  pausado = false;
  bot.sendMessage(msg.chat.id, "▶️ Envio RETOMADO");
});

bot.onText(/\/status/, (msg) => {
  bot.sendMessage(msg.chat.id,
    `📊 STATUS:

📥 Fila: ${fila.length}
📤 Enviados hoje: ${enviadosHoje}
⏸️ Pausado: ${pausado ? "SIM" : "NÃO"}`
  );
});

bot.onText(/\/stats/, (msg) => {
  bot.sendMessage(msg.chat.id,
    `📈 ESTATÍSTICAS:

- Fila atual: ${fila.length}
- Enviados: ${enviadosHoje}`
  );
});

console.log("🚀 BOT PRO RODANDO");
