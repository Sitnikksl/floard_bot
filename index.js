'use strict';
import fetch from "node-fetch";
import TelegramApi from "node-telegram-bot-api";
import * as DB from "./classes.js"

// #region TEST DB.Database

//let db = new DB.Database('database.json');
//console.log(db);
//db.Games.deleteGame(2);
//console.log(db);
// db.Games.addGame('Бэнг', 3, 8, DB.Durations.Types.long, DB.ActionTypes.Types.single, false);
// db.Games.addGame('Свинтус', 2, 10, DB.Durations.Types.fast, DB.ActionTypes.Types.single, false);
// db.Games.addGame('Манчкин', 3, 6, DB.Durations.Types.long, DB.ActionTypes.Types.single, false);
// db.Games.addGame('Мы обречены', 4, 10, DB.Durations.Types.fast, DB.ActionTypes.Types.single, false);
// db.Games.addGame('Codenames Pictures', 2, 12, DB.Durations.Types.average, DB.ActionTypes.Types.teams, true);
// db.Games.addGame('Битва магов', 2, 6, DB.Durations.Types.long, DB.ActionTypes.Types.single, false);
// db.Games.addGame('Эволюция', 2, 4, DB.Durations.Types.long, DB.ActionTypes.Types.single, false);
// db.Games.addGame('Взрывные котята', 2, 5, DB.Durations.Types.fast, DB.ActionTypes.Types.single, false);
// db.Games.addGame('Соображай', 2, 10, DB.Durations.Types.fast, DB.ActionTypes.Types.single, true);
// db.Games.addGame('Шпион', 3, 12, DB.Durations.Types.fast, DB.ActionTypes.Types.single, true);
// db.Games.addGame('Сопротивление', 5, 10, DB.Durations.Types.average, DB.ActionTypes.Types.single, true);
// db.Games.addGame('Alias', 2, 12, DB.Durations.Types.average, DB.ActionTypes.Types.teams, true);
// db.Games.addGame('Шляпа', 2, 12, DB.Durations.Types.long, DB.ActionTypes.Types.teams, true);
// db.Games.addGame('Гравити Фолз: Спасти Пухлю', 2, 5, DB.Durations.Types.average, DB.ActionTypes.Types.single, false);
// db.Games.addGame('GameDev Sim', 2, 4, DB.Durations.Types.long, DB.ActionTypes.Types.single, false);
// db.Games.addGame('Монополия', 2, 6, DB.Durations.Types.long, DB.ActionTypes.Types.single, false);
// db.Games.addGame('Лото', 2, 12, DB.Durations.Types.average, DB.ActionTypes.Types.single, true);
// db.Games.addGame('Элементарно', 1, 12, DB.Durations.Types.long, DB.ActionTypes.Types.coop, true);
// db.Games.addGame('Мафия', 5, 12, DB.Durations.Types.average, DB.ActionTypes.Types.single, true);
// db.Games.addGame('Покер', 2, 12, DB.Durations.Types.average, DB.ActionTypes.Types.single, false);
// db.Games.addGame('Домино', 2, 4, DB.Durations.Types.fast, DB.ActionTypes.Types.single, false);
// console.log(db);
// db.save();

//#endregion

//#region main code

// let todayActiveMembers = dataBase.members;
// let data = JSON.stringify(tempBase, null, '\t');
// fs.writeFileSync('./dataBases/dataBase.json', data);


// let nodePath = process.argv[2];
// const token = process.argv[2];
// const bot = new TelegramApi(token, {polling: true})

// const start = () =>{
    
//     bot.setMyCommands([
//         {command: '/start', description: 'Команда старта'},
//         {command: '/members', description: 'Узнать кто есть в наполках'},
//         {command: '/firstmove', description: 'Узнать кто ходит первым'},
//         {command: '/roll', description: 'Бросить кубик'}
//     ])

//     bot.on('message', async msg=>{
//         const text = msg.text;
//         const chatId = msg.chat.id;

//         if (text === '/start'){
//             await bot.sendMessage(chatId, "Добро пожаловать в наполочного бота!");
//             // await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/b0d/85f/b0d85fbf-de1b-4aaf-836c-1cddaa16e002/1.gif');
//         }else if(text ==='/firstmove'){
//             let firstMoveMessage = 'Посылаю сигналы вселенной...' + '\n' + 'Иии... первым будет ходить...' + '\n' + '🥁🥁🥁' + '\n';
//             await bot.sendMessage(chatId, firstMoveMessage);
//             bot.sendAnimation(chatId, 'https://i.gifer.com/cE1.gif');
//             function getRandomInt(max) {
//                 return Math.floor(Math.random() * max);
//             }
//             let randomCount = getRandomInt(tempBase.members.length);
//             let firstMan = tempBase.members[randomCount].Name 
//             + ' ' + tempBase.members[randomCount].SurName
//             + ' 🎉';
//             setTimeout(() => {
//                 bot.sendMessage(chatId, firstMan)
//             }, 3000);
            
//         }else if(text === '/members'){
//             let allMembers = 'Вот текущий состав наполок: ' + '\n' + '\n';
            
//             for(let i=0;i<tempBase.members.length; i++){
//                 allMembers += '✨ ' + tempBase.members[i].SurName + ' ' + tempBase.members[i].Name + '\n'
//             }
//             bot.sendMessage(chatId, allMembers)
//         }
//         else if(text === '/roll'){
//             bot.sendDice(chatId);
//         }
//     })
// }
// start();

//#endregion