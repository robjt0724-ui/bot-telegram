const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

const grupoA = -1002110613167;
const grupoB = -1001831601806;

bot.on('message', async (msg) => {
  if (msg.chat.id !== grupoA) return;

  try {
    // TEXTO
    if (msg.text) {
      await bot.sendMessage(grupoB, msg.text);
    }

    // FOTO
    if (msg.photo) {
      const fileId = msg.photo[msg.photo.length - 1].file_id;
      await bot.sendPhoto(grupoB, fileId, { caption: msg.caption || '' });
    }

    // VÍDEO
    if (msg.video) {
      await bot.sendVideo(grupoB, msg.video.file_id, { caption: msg.caption || '' });
    }

    // ÁUDIO
    if (msg.audio) {
      await bot.sendAudio(grupoB, msg.audio.file_id);
    }

    // DOCUMENTO
    if (msg.document) {
      await bot.sendDocument(grupoB, msg.document.file_id);
    }

  } catch (error) {
    console.log('Erro:', error.message);
  }
});
