import fetch from "node-fetch";
import TelegramApi from "node-telegram-bot-api";
import sqlite3 from "sqlite3"


let nodePath = process.argv[2];
const token = process.argv[2];
const bot = new TelegramApi(token, {polling: true})

let testFunc = (err, answer) =>{
    if (answer != undefined) {
        console.log(answer[0]['ID']);
    }
}

const start = () =>{

    const db = new sqlite3.Database("./FloardDatabase.db");
    let test = db.all('SELECT * FROM Members;', testFunc);

    bot.setMyCommands([
        {command: '/start', description: 'Команда старта'}
    ])

    bot.on('message', async msg=>{
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start'){
            await bot.sendMessage(chatId, 'Добро пожаловать в бота для наполок!');
            // await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/b0d/85f/b0d85fbf-de1b-4aaf-836c-1cddaa16e002/1.gif');
         }

    })
}
start();