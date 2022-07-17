// 'use strict';
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

//переменные для работы в клиентской части
let activeMembers = '';
let activeMembersList = '';
//окончание объявления переменных

const botOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Участники 💁🏼‍♂️', callback_data: '1'}, {text: 'Участники 💁🏼‍♂️', callback_data: '1'}]
        ]
    })
}

const start = () =>{
    
    bot.setMyCommands([
        {command: '/start', description: 'Команда старта'},
        {command: '/firstmove', description: 'Узнать кто ходит первым'},
        {command: '/roll', description: 'Бросить кубик'}
    ])

    bot.on('message', async (msg) =>{
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start'){
            await bot.sendMessage(chatId, "Добро пожаловать в наполочного бота!");
        }else if(text ==='/firstmove'){
            activeMembers ='';
            activeMembersList ='';
            activeMembers = db.Members.getAllWithIsActive();
            await bot.sendMessage(chatId, '...[театральная пауза]')
            await bot.sendMessage(chatId, 'Иии... Первым будет ходить...')
            await bot.sendAnimation(chatId, 'https://i.gifer.com/cE1.gif')

            for(let i =0; i<activeMembers.length; i++){
                activeMembersList += '' + activeMembers[i].FullName + '\n';
            }
            function getFirstMoveMan() {
                let random = 0 + Math.random() * (activeMembers.length + 1 - 0);
                random = Math.floor(random)
                return activeMembers[random].FullName
            }
            setTimeout(() => {
                bot.sendMessage(chatId, getFirstMoveMan() + ' 🎉')
            }, 3000);

            console.log(activeMembersList);
        }else if(text ==='/menu'){
            bot.sendMessage(chatId, 'Вот что я могу тебе предложить: ', botOptions)
        }
        else if(text === '/roll'){
            bot.sendDice(chatId);
        }
    })
    bot.on('inline_query', async (msg) =>{
        //bot.answerCallbackQuery(msg.id);
        console.log(msg.id);
    })
}

start();
// #endregion

// console.log(temp.getByFullName('Ян Яблонский').Nickname);