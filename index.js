'use strict';
import fetch from "node-fetch";
import TelegramApi from "node-telegram-bot-api";
import * as DB from "./classes.js"

// #region TEST DB.Database

let db = new DB.Database('database.json');
// console.log(db);
db.save();

// #endregion

// #region main code

let nodePath = process.argv[2];
const token = process.argv[2];
const bot = new TelegramApi(token, {polling: true})

const start = () =>{
    
    bot.setMyCommands([
        {command: '/start', description: 'Команда старта'},
        {command: '/members', description: 'Узнать кто есть в наполках'},
        {command: '/firstmove', description: 'Узнать кто ходит первым'},
        {command: '/roll', description: 'Бросить кубик'}
    ])

    bot.on('message', async msg=>{
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start'){
            await bot.sendMessage(chatId, "Добро пожаловать в наполочного бота!");
        }else if(text ==='/firstmove'){
            
        }else if(text === '/members'){
        }
        else if(text === '/roll'){
            bot.sendDice(chatId);
        }
    })
}
start();

// #endregion