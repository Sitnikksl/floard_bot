'use strict';
import fetch from "node-fetch";
import TelegramApi from "node-telegram-bot-api";
import sqlite3 from "sqlite3";
import dataDabse from './dataBases/dataBase.json' assert {type: 'json'};
import * as fs from 'fs';

let tempBase = dataDabse;
tempBase.members[1].IsActive = true;
console.log(tempBase);
let data = JSON.stringify(tempBase);
fs.writeFileSync('./dataBases/dataBase.json', data);


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
            // await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/b0d/85f/b0d85fbf-de1b-4aaf-836c-1cddaa16e002/1.gif');
        }
        else if (text === '/who'){
            let listMembers = '';
            for (let i = 0; i < Object.values(testReturn).length; ++i) {
                listMembers += testReturn[i]['Name'];
                listMembers += '\n'
            }
            await bot.sendMessage(chatId, listMembers);
        }else if(text ==='/firstmove'){
            let firstMoveMessage = 'Посылаю сигналы вселенной...' + '\n' + 'Иии... первым будет ходить...' + '\n' + '🥁🥁🥁' + '\n';
            await bot.sendMessage(chatId, firstMoveMessage);
            bot.sendAnimation(chatId, 'https://i.gifer.com/cE1.gif');
            let listMembers = Object.values(testReturn).length;
            function getRandomInt(max) {
                return Math.floor(Math.random() * max);
            }
            let random = getRandomInt(listMembers);
            let finalMember = testReturn[random]['Name'];
            finalMember += ' ' + testReturn[random]['Surname'];
            finalMember += ' ' + '🎉';
            await setTimeout(() => {
                bot.sendMessage(chatId, finalMember);
            }, 3000);
        }else if(text === '/members'){
            let allMembers = 'Вот текущий состав наполок: ' + '\n' + '\n';
            for(let i = 0; i<Object.values(testReturn).length; i++){
                allMembers += '🎲 ' + testReturn[i]['Surname'];
                allMembers += ' ' + testReturn[i]['Name'] + '\n';
            }
            bot.sendMessage(chatId, allMembers);
        }else if(text === '/active'){
            for(let i=0; i<dataDabse.members.length; i++){
                if(dataDabse.members[i].IsActive == true){
                    console.log(dataDabse.members[i].Name);
                }
            }
        }
        else if(text === '/roll'){
            bot.sendDice(chatId);
        }
    })
}
start();