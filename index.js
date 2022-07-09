import fetch from "node-fetch";
import TelegramApi from "node-telegram-bot-api";
let nodePath = process.argv[2];
const token = process.argv[2];
const bot = new TelegramApi(token, {polling: true})

const start = () =>{

    bot.setMyCommands([
        {command: '/start', description: 'Команда старта'}
    ])

    bot.on('message', async msg=>{
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start'){
            return bot.sendMessage(chatId, 'Hello World');
         }

    })
}
start();