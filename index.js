const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

// ================== GRUPOS ==================
const grupoC = -1003906204677;
const grupoA = -1002110613167;
const grupoB = -1001831601806;

// ================== ESTADO ==================
let fila = [];
let pausado = false;
let enviados = 0;
let intervaloMinutos = 45;

// ================== TEMPO INTELIGENTE ==================
let modoAtual = "normal";
let ultimoSwitch = Date.now();

function gerarTempo() {
  const agora = Date.now();

  if (agora - ultimoSwitch > 6 * 60 * 60 * 1000) {
    ultimoSwitch = agora;
    const modos = ["rapido", "normal", "lento"];
    modoAtual = modos[Math.floor(Math.random() * modos.length)];
    console.log("🔄 Novo modo:", modoAtual);
  }

  let minutos;

  if (modoAtual === "rapido") {
    minutos = 30 + Math.random() * 15;
  } else if (modoAtual === "normal") {
    minutos = 40 + Math.random() * 20;
  } else {
    minutos = 55 + Math.random() * 25;
  }

  return Math.floor(minutos);
}

// ================== PERSISTÊNCIA ==================
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

// ================== 15 MENSAGENS COMPLETAS ==================
const mensagens = [

`🎬🍿 Cansado de abrir vários aplicativos e não achar nada bom? 😑
Aqui você resolve tudo em um só lugar 🔥

📺 Filmes atualizados todos os dias
📺 Séries completas pra maratonar
📺 Canais ao vivo liberados

💰 Só R$35 por mês
⏱️ Teste grátis por 3 horas

👇 Clique nos botões abaixo e veja como funciona`,

`🎬 Você ainda perde tempo procurando algo pra assistir? 😑
Aqui já está tudo pronto 🔥

📺 Filmes novos
📺 Séries completas
📺 TV ao vivo sem travar

💰 Apenas R$35/mês
⏱️ Teste grátis disponível

👇 Clique abaixo e descubra`,

`🍿 Chega de pular de app em app 😤
Aqui você tem tudo em um só lugar 🔥

📺 Filmes
📺 Séries
📺 Canais liberados

💰 R$35 por mês
⏱️ Teste grátis

👇 Saiba mais clicando abaixo`,

`🎬 Isso aqui ainda é pouco conhecido 👀
Mas quem usa não larga mais 🔥

📺 Conteúdo atualizado
📺 Tudo organizado
📺 Sem complicação

💰 R$35/mês
⏱️ Teste grátis

👇 Clique abaixo`,

`🍿 Você paga vários apps e mesmo assim não acha nada 😑
Aqui é diferente 🔥

📺 Filmes + Séries + TV
📺 Tudo liberado

💰 Só R$35/mês
⏱️ Teste grátis

👇 Clique e veja`,

`🎬 Tudo que você precisa pra assistir está aqui 👀
Sem enrolação 🔥

📺 Filmes atualizados
📺 Séries completas
📺 Canais ao vivo

💰 R$35/mês
⏱️ Teste grátis

👇 Saiba mais`,

`🍿 Tem gente economizando e assistindo muito mais 👀
Tudo em um só lugar 🔥

📺 Filmes
📺 Séries
📺 TV ao vivo

💰 R$35 mensal
⏱️ Teste grátis

👇 Clique abaixo`,

`🎬 Se você gosta de assistir sem dor de cabeça 😌
Isso aqui resolve fácil 🔥

📺 Conteúdo completo
📺 Tudo liberado

💰 R$35/mês
⏱️ Teste grátis

👇 Clique agora`,

`🍿 Chega de complicação 😤
Aqui é só entrar e dar play 🔥

📺 Filmes + Séries + TV

💰 R$35/mês
⏱️ Teste grátis

👇 Saiba mais`,

`🎬 Nem todo mundo conhece isso ainda 👀
Mas já tem gente usando todo dia 🔥

📺 Filmes
📺 Séries
📺 Canais

💰 R$35/mês
⏱️ Teste grátis

👇 Clique abaixo`,

`🍿 Você vai se surpreender com isso 👀
Tudo em um só lugar 🔥

📺 Conteúdo completo
📺 Sempre atualizado

💰 R$35/mês
⏱️ Teste grátis

👇 Saiba mais`,

`🎬 Pare de perder tempo procurando 😑
Aqui já está tudo pronto 🔥

📺 Filmes atualizados
📺 Séries completas
📺 TV ao vivo

💰 R$35 mensal
⏱️ Teste grátis

👇 Clique agora`,

`🍿 A forma mais simples de assistir tudo 👀
Sem enrolação 🔥

📺 Filmes
📺 Séries
📺 Canais

💰 R$35/mês
⏱️ Teste grátis

👇 Saiba mais`,

`🎬 Você não precisa de vários aplicativos 😤
Aqui resolve tudo 🔥

📺 Filmes + Séries + TV

💰 R$35/mês
⏱️ Teste grátis

👇 Clique abaixo`,

`🍿 Muita gente ainda não descobriu isso 👀
Mas quem começa não larga 🔥

📺 Conteúdo completo
📺 Tudo liberado

💰 R$35/mês
⏱️ Teste grátis

👇 Saiba mais`

];

// ================== NÃO REPETIR ==================
let ultimaMsg = "";
function msgAleatoria() {
  let nova;
  do {
    nova = mensagens[Math.floor(Math.random() * mensagens.length)];
  } while (nova === ultimaMsg);
  ultimaMsg = nova;
  return nova;
}

// ================== BOTÕES ==================
const botoes = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "🧪 TESTAR AGORA", url: "https://wa.link/e8t534" }],
      [{ text: "👉 SAIBA MAIS AQUI", url: "https://wa.link/e8t534" }]
    ]
  }
};

// ================== COMANDOS ==================
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
📥 Fila: ${fila.length}
📤 Enviados: ${enviados}
⚙️ Modo: ${modoAtual}`);
});

// ================== CAPTURA ==================
bot.on('message', (msg) => {
  if (msg.chat.id !== grupoC) return;

  if (msg.photo) {
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    fila.push(fileId);
    salvarFila();
  }
});

// ================== LOOP ==================
async function loop() {

  if (!pausado && fila.length > 0) {
    const fileId = fila.shift();
    salvarFila();

    try {
      const texto = msgAleatoria();

      await bot.sendPhoto(grupoA, fileId, {
        caption: texto,
        ...botoes
      });

      await bot.sendPhoto(grupoB, fileId, {
        caption: texto,
        ...botoes
      });

      enviados++;
      console.log("✅ enviado:", enviados);

    } catch (err) {
      console.log("❌ erro:", err.message);
    }
  }

  const tempo = gerarTempo();
  console.log(`⏱️ Próximo envio em ${tempo} minutos`);

  setTimeout(loop, tempo * 60 * 1000);
}

loop();

console.log("🚀 BOT FINAL COMPLETO (MENSAGENS + TEMPO INTELIGENTE)");
