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

// 🔘 BOTÕES (2 lado a lado)
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

// 🔁 MENSAGENS (SUAS COMPLETAS)
const mensagens = [
`🎬🍿 Tem gente pagando vários apps sem nem usar direito… 😑
Aqui você resolve tudo em um só lugar, com filmes e séries sem complicação 🔥

💰 Só R$35 por mês
⏱️ Teste grátis por 3 horas

👉 clique no nosso WhatsApp aqui agora: https://wa.link/e8t534`,

`🎬 Você ainda fica procurando filme e não acha nada bom? 😑
Aqui já tá tudo pronto pra assistir 🔥

💰 Acesso por R$35/mês
⏱️ Teste grátis de 3 horas

👉 clique no nosso WhatsApp aqui agora: https://wa.link/e8t534`,

`🍿 Chega de pular de app em app sem achar nada… 😤
Aqui você tem tudo em um só lugar 🔥

💰 R$35 por mês
⏱️ 3 horas grátis pra testar

👉 clique no nosso WhatsApp aqui agora: https://wa.link/e8t534`,

`🎬 Isso aqui ainda é pouco conhecido… 👀
Mas quem começa a usar não larga mais 🔥

💰 Só R$35/mês
⏱️ Teste grátis por 3 horas

👉 clique no nosso WhatsApp aqui agora: https://wa.link/e8t534`,

`🍿 Você perde mais tempo escolhendo do que assistindo? 😑
Aqui já tá tudo organizado pra você 🔥

💰 R$35 mensal
⏱️ Teste grátis de 3h

👉 clique no nosso WhatsApp aqui agora: https://wa.link/e8t534`,

`🎬 Nem todo mundo conhece isso ainda… 👀
Mas já tem gente usando todo dia 🔥

💰 R$35 por mês
⏱️ 3 horas grátis

👉 clique no nosso WhatsApp aqui agora: https://wa.link/e8t534`,

`🍿 Cansado de não achar nada bom pra assistir? 😤
Aqui só tem conteúdo que realmente vale a pena 🔥

💰 Só R$35/mês
⏱️ Teste grátis por 3h

👉 clique no nosso WhatsApp aqui agora: https://wa.link/e8t534`,

`🎬 Isso aqui facilita demais na hora de assistir… 🔥
Tudo em um só lugar, sem enrolação 👀

💰 R$35 mensal
⏱️ 3 horas grátis pra testar

👉 clique no nosso WhatsApp aqui agora: https://wa.link/e8t534`,

`🍿 Tem gente descobrindo isso agora… 👀
E não quer mais saber de outro app 🔥

💰 R$35 por mês
⏱️ Teste grátis de 3h

👉 clique no nosso WhatsApp aqui agora: https://wa.link/e8t534`,

`🎬 Chega de complicação pra assistir filme 😑
Aqui é simples e direto 🔥

💰 Só R$35/mês
⏱️ 3 horas grátis

👉 clique no nosso WhatsApp aqui agora: https://wa.link/e8t534`,

`🎬🍿 Tá cansado de abrir app e não achar nada bom? 😑
Aqui já tá tudo organizado pra você só entrar e assistir 🔥

💰 R$35 por mês
⏱️ Teste grátis de 3 horas

👉 clique no nosso WhatsApp aqui agora: https://wa.link/e8t534`,

`🍿 A verdade é que hoje você paga vários apps…
e mesmo assim não acha nada que anima 😑

Aqui é diferente. Tudo em um só lugar 🔥

💰 Só R$35/mês
⏱️ 3 horas grátis pra testar

👉 clique no nosso WhatsApp aqui agora: https://wa.link/e8t534`,

`🎬 Você não precisa de vários aplicativos pra assistir bem… 😤
Com um só já resolve tudo 🔥

💰 R$35 mensal
⏱️ Teste grátis de 3h

👉 clique no nosso WhatsApp aqui agora: https://wa.link/e8t534`,

`🍿 Muita gente ainda não percebeu isso… 👀
Dá pra ter tudo em um lugar só e pagar bem menos 🔥

💰 Só R$35 por mês
⏱️ 3 horas grátis

👉 clique no nosso WhatsApp aqui agora: https://wa.link/e8t534`,

`🎬 Chega de complicar na hora de assistir… 😑
Aqui é só entrar e dar play 🔥

💰 R$35/mês
⏱️ Teste grátis por 3 horas

👉 clique no nosso WhatsApp aqui agora: https://wa.link/e8t534`,

`🍿 Tem gente economizando e assistindo muito mais… 👀
Tudo porque parou de usar vários apps separados 🔥

💰 Só R$35 mensal
⏱️ 3h grátis pra testar

👉 clique no nosso WhatsApp aqui agora: https://wa.link/e8t534`,

`🎬 Se você gosta de assistir sem dor de cabeça… 😌
Isso aqui resolve fácil 🔥

💰 R$35 por mês
⏱️ Teste grátis de 3 horas

👉 clique no nosso WhatsApp aqui agora: https://wa.link/e8t534`
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

    console.log("Fila:", fila.length);
  }
});

// ⏳ ENVIO AUTOMÁTICO
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

    console.log("Enviado. Fila:", fila.length);
  } catch (err) {
    console.log("Erro:", err.message);
  }

}, 1 * 60 * 1000);

console.log("🚀 BOT COM 2 BOTÕES RODANDO");
