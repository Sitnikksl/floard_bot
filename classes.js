import * as fs from 'fs';

/**
 * DONE:
 *  1. Game class
 *  3. Preference class
 *  4. Preferences class (продумать механизм поддержки целостности)
 *  6. Метод add/delete Member в Members
 *  7. Сохранение и обновление IDCounter в Members и Games
 *  8. BirthdayGroupID в Members
 *  2. Games class (addGame, deleteGame)
 *  10. Add\Delete в классе Preferences
 *  15. Разделить Members на 3 класса: базовый, списковый, связанный с JSON
 *  16. Разделить Games на 3 класса: базовый, списковый, связанный с JSON
 *  17. Класс, представляющий файл JSON (Database)
 * TO DO:
 *  9. Функционал Preferences по поиску игр для заданного списка ID участников
 *  11. Задокументировать весь код
 *  12. Вывод параметров в исключении
 *  13. Продумать политику создания объектов - допустимы ли undefined поля?
 *  14. Продумать необходимость внедрения toString методов в объекты
 *  18. Сохранение backup файлов в классе Database
 */

//#region Members
export class Member {
    _ID = 0;
    _Name = '';
    _Surname = '';
    _Nickname = '';
    _TelegramID = '';
    _BirthDate = '';
    _BirthdayGroupID = '';
    _IsActive = false;

    /**
     * @param {number} setID
     * @param {string} setName
     * @param {string} setSurname
     * @param {string} setNickname
     * @param {string} setTelegramID
     * @param {string} setBirthDate
     * @param {string} setBirthdayGroupID
     * @param {boolean} setIsActive
     */
    constructor(setID, setName, setSurname, setNickname, setTelegramID, 
        setBirthDate, setBirthdayGroupID, setIsActive) {
        this._ID = setID;
        this._Name = setName;
        this._Surname = setSurname;
        this._Nickname = setNickname;
        this._TelegramID = setTelegramID;
        this._BirthDate = setBirthDate;
        this._BirthdayGroupID = setBirthdayGroupID;
        this._IsActive = setIsActive;
    }
    clone() {
        return new Member(this._ID, this._Name, this._Surname, this._Nickname, this._TelegramID, this._BirthDate, this._BirthdayGroupID, this._IsActive);
    }
    //#region Getters && Setters
    get ID() {
        return this._ID;
    }
    // /**
    //  * @param {number} newID
    //  */
    // set ID(newID) {
    //     this._ID = newID;
    // }
    get Name() {
        return this._Name;
    }
    /**
     * @param {string} newName
     */
    set Name(newName) {
        this._Name = newName;
    }
    get Surname() {
        return this._Surname;
    }
    /**
     * @param {string} newSurname
     */
    set Surname(newSurname) {
        this._Surname = newSurname;
    }
    get Nickname() {
        return this._Nickname;
    }
    /**
     * @param {string} newNickname
     */
    set Nickname(newNickname) {
        this._Nickname = newNickname;
    }
    get TelegramID() {
        return this._TelegramID;
    }
    /**
     * @param {string} TelegramID
     */
    set TelegramID(newTelegramID) {
        this._TelegramID = newTelegramID;
    }
    get BirthDate() {
        return this._BirthDate;
    }
    /**
     * @param {string} BirthDate
     */
    set BirthDate(newBirthDate) {
        this._BirthDate = newBirthDate;
    }
    get BirthdayGroupID() {
        return this._BirthdayGroupID;
    }
    /**
     * @param {string} BirthDate
     */
    set BirthdayGroupID(groupID) {
        this._BirthdayGroupID = groupID;
    }
    get IsActive() {
        return this._IsActive;
    }
    /**
     * @param {string} IsActive
     */
    set IsActive(newIsActive) {
        this._IsActive = newIsActive;
    }
    /**
     * Возвращает строку вида: Name + ' ' + Surname
     */
    get FullName() {
        return this._Name + ' ' + this._Surname;
    }
    //#endregion
    toJSON() {
        return {
            ID: this._ID,
            Name: this._Name,
            Surname: this._Surname,
            Nickname: this._Nickname,
            TelegramID: this._TelegramID,
            BirthDate: this._BirthDate,
            BirthdayGroupID: this._BirthdayGroupID,
            IsActive: this._IsActive
        }
    }
}

function makeMemberArr(resArr, members) {
    for (let i = 0; i < members.length; ++i) {
        resArr.push(new Member(members[i].ID, 
            members[i].Name,
            members[i].Surname,
            members[i].Nickname,
            members[i].TelegramID,
            members[i].BirthDate,
            members[i].BirthdayGroupID,
            members[i].IsActive));
    }
    return resArr;
} 

class MembersBase extends Array {
    getByNickname(fndNickname) {
        return this.find((member) => {
            if (member.Nickname === fndNickname) {
                return true;
            }
            return false;
        });
    }
    getByFullName(fndFullName) {
        return this.find((member) => {
            if (member.FullName === fndFullName) {
                return true;
            }
            return false;
        });
    }
    /**
     * @param {number} fndID ID для поиска в Members
     * @returns {Member|undefined} Участник с искомым fndID или undefined если ID не найден
     */
    getByID(fndID) {
        return this.find((member, ind, obj) => {
            if (member.ID == fndID) {
                return true;
            }
            return false;
        });
    }
    getByTlgID(fndID) {
        return this.find((member, ind, obj) => {
            if (member.TelegramID == fndID) {
                return true;
            }
            return false;
        });
    }
    getNamesArray() {
        let resArr = new Array();
        this.forEach((val) => {
            resArr.push(val.Name);
        });
        return resArr;
    }
}

export class MembersDatabase extends MembersBase {
    #preferencesLink = undefined;
    #IDCounter = 0;
    // constructor(...members) {
    //     if (members == undefined || members.length == 0) {
    //         super();
    //     }
    //     else {
    //         if (members.length == 1 && (typeof(members[0]) === 'number')) {
    //             super(members[0]);
    //         } else {
    //             let tmpArr = new Array();
    //             makeMemberArr(tmpArr, members);
    //             super(...tmpArr);
    //         }
    //     }
    // }
    /**
     * Deep copy! Данные массива arrayLike не будут связаны с данными результирующего массива. Изменение arrayLike не приведёт к изменению результата.
     * @param arrayLike An array-like object to convert to an array.
     * @param mapFn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    static from(arrayLike, mapFn, thisArg) {
        let tmpArr = new MembersDatabase();
        makeMemberArr(tmpArr, arrayLike);
        if (mapFn != undefined) {
            tmpArr.map(mapFn, thisArg);
        }
        return tmpArr;
    }
    static fromJSONobject(jsonObj) {
        let result = MembersDatabase.from(jsonObj.data);
        result.#IDCounter = jsonObj.IDCounter;
        return result;
    }
    /**
     * Связывает объект Members с объектом Preferences. При наличии связи изменения в Members будут распространяться на Preferences.
     * (при удалении Member-а, он будет удаляться и из Preferences)
     * Если ничего не понял - не используй этот метод. Он технический и нужен для технических нужд.
     * @param {Preferences} prefObj Объект Preferences для связи.
     */
    bindPreferences(prefObj)
    {
         if (prefObj instanceof Preferences) {
             this.#preferencesLink = prefObj;
         } else {
             throw 'MembersModel.bindPreferences() error. Input value (prefObj) is not a Preferences object.';
         }
    }
    /**
     * Проверяет связь this с Preferences
     * @returns {boolean} - true если объект связан с Preferences и false в ином случае
     */
    isLinked() {
        if (this.#preferencesLink === undefined) {
            return false;
        }
        return true;
    }
    /**
     * Добавляет нового участника в Members. Возвращает ID созданного участника.
     * @param {string} mName - (обязательный параметр) Имя участника
     * @param {string} mSurname - (необязательный параметр) Фамилия участника
     * @param {string} mNickname - (необязательный параметр) Кличка\Никнейм участника
     * @param {string} mTelegramID - (необязательный параметр) ID Telegram аккаунта
     * @param {string} mBirthDate - (необязательный параметр) Дата рождения
     * @param {string} mBirthdayGroupID (необязательный параметр) ID Telegram беседы для подготовки дня рождения
     * @param {boolean} mIsActive - (необязательный параметр) Активность участника
     * @returns {number} ID нового участника
     */
    addMember(mName, mSurname = '', mNickname = '', mTelegramID = '', mBirthDate = '', mBirthdayGroupID = '', mIsActive = true) {
        if (mName === undefined || mName === '') {
            throw 'MembersDatabase.addMember() error. Member name can\'t be undefined or empty!';
        }
        if (!this.isLinked()) {
            throw 'MembersDatabase.addMember() error. Can\'t addMember without preferencesLink. Please bind this to propper Prefereces object.';
        }
        let retID = this.#IDCounter;
        this.#IDCounter += 1;
        super.push(new Member(retID, mName, mSurname, mNickname, mTelegramID, mBirthDate, mBirthdayGroupID, mIsActive));
        this.#preferencesLink.connectMemberWithAll(retID);
        return retID;
    }
    deleteMember(mID) {
        if (!this.isLinked()) {
            throw 'MembersDatabase.deleteMember() error. Can\'t delete member without preferencesLink. Please bind this to propper Prefereces object.';
        }
        let fndIndex = this.findIndex((val) => {return val.ID == mID});
        if (fndIndex != -1) {
            let deletionRes = this.splice(fndIndex, 1);
            this.#preferencesLink.deleteAllWithMember(mID);
        }
        else {
            throw 'Members.deleteMember() error. Member with input ID doesn\'t exist.';
        }
    }
    filter(predicate, thisArg) {
        return MembersList.from(this, super.filter(predicate, thisArg));
    }
    /**
     * Фильтрует Members по значению поля IsActive. Возвращает новый объект Members с результатами фильтрации.
     * Deep copy! Новый объект Members не будет связан с объектом this. Изменения this\нового объекта не приведут к
     * изменениям нового объекта\this.
     * @param {boolean} isActiveState Members с этим значением IsActive будут добавлены в результирующий массив
     */
    getAllWithIsActive(isActiveState = true) {
        return this.filter((val) => {return val.IsActive == isActiveState});
    }
    getAll() {
        return MembersList.from(this, this);
    }
    /**
     * Создаёт JSON представление объекта Members в формате: {"members": [{this[0]}, ..., {this[this.length]}]}
     */
    toJSON() {
        return { Members: {
                            data: Array.from(this),
                            IDCounter: this.#IDCounter
                        }
            };
    }
}

export class MembersList extends MembersBase {
    #linkToModel = undefined;
    static get [Symbol.species]() { return Array; }
    constructor(modelLink, ...data) {
        if (modelLink === undefined || !(modelLink instanceof MembersDatabase)) {
            throw 'MembersList.constructor() error. Object must be linked to propper MembersDatabase object.';
        }
        super(...data);
        this.#linkToModel = modelLink;
    }
    /**
     * 
     * @param {MembersDatabase} modelLink 
     * @param {Array} arrayLike 
     * @param {function(v, k)} mapFn 
     * @param {any} thisArg 
     * @returns {MembersList}
     */
    static from(modelLink, arrayLike, mapFn, thisArg) {
        let tmpArr = new MembersList(modelLink);
        makeMemberArr(tmpArr, arrayLike);
        if (mapFn !== undefined) {
            tmpArr.map(mapFn, thisArg);
        }
        return tmpArr;
    }
    filter(predicate, thisArg) {
        return MembersList.from(this.#linkToModel, super.filter(predicate, thisArg));
    }
    includeByID(memberID) {
        let includingMember = this.#linkToModel.getByID(memberID);
        if (includingMember === undefined) {
            throw 'MembersList.includeByID() error. Invalid input ID.';
        }
        return this.push(includingMember.clone());
    }
    excludeByID(memberID) {
        for (let i = 0; i < this.length; ++i) {
            if (this[i].ID == memberID) {
                this.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    includeByFullName(fullname) {
        let includingMember = this.#linkToModel.getByFullName(fullname);
        if (includingMember === undefined) {
            throw 'MembersList.includeByFullName() error. Invalid input name.';
        }
        return this.push(includingMember.clone());
    }
    excludeByFullName(fullname) {
        let excludingMember = this.#linkToModel.getByFullName(fullname);
        if (excludingMember === undefined) {
            return false;
        }
        let memberID = excludingMember.ID;
        return this.excludeByID(memberID);
    }
}

//#endregion
//#region Games
export class ActionTypes {
    static #types = ['Кооперативная', 'Командная', 'Каждый сам за себя'];
    static #Types = {coop: this.#types[0], teams: this.#types[1], single: this.#types[2]};
    /**
     * Возвращает ID типа игры по его названию
     * @param {string} fndName 
     */
    static getIDByName(fndName) {
        let res = this.#types.findIndex((val) => {return val == fndName});
        if (res == -1) {
            throw 'ActionTypes.getIDByName() error. Unknown name.';
        }
        return res;
    }
    /**
     * Возвращает название типа игры по его ID
     * @param {number} fndID 
     */
    static getNameByID(fndID) {
        let res = this.#types[fndID];
        if (res === undefined) {
            throw 'ActionTypes.getNameByID() error. Unknown ID.';
        }
        return res;
    }
    /**
     * Возвращает массив строк, содержащий все названия типов
     */
    static getAllTypesArr() {
        return Array.from(this.#types);
    }
    static get Types() {
        return this.#Types;
    }
    //#region toJSON commented
    // static toJSON() {
    //     return {
    //         ActionTypes: this.#types
    //     };
    // }
    // /**
    //  * Добавляет новый тип игры.
    //  * Возрващает: -1 - если тип с таким названием уже существует (вставка не происходит).
    //  *             number - индекс вставленного типа
    //  * @param {string} typeName - название нового типа игры
    //  */
    // static add(typeName) {
    //     if (this.#types.findIndex((val) => {return val == typeName}) == -1) {
    //         let res = this.#types.push(typeName);
    //         return  res - 1;
    //     }
    //     return -1;
    // }
    //#endregion
}

export class Durations {
    static #durations = ['Быстрая', 'Средняя', 'Долгая'];
    static #Types = {fast: this.#durations[0], average: this.#durations[1], long: this.#durations[2]};
    /**
     * Возвращает ID типа продолжительности по его названию
     * @param {string} fndName 
     */
    static getIDByName(fndName) {
        let res = this.#durations.findIndex((val) => {return val == fndName});
        if (res == -1) {
            throw 'Durations.getIDByName() error. Unknown name.';
        }
        return res;
    }
    /**
     * Возвращает название типа продолжительности по его ID
     * @param {number} fndID 
     */
    static getNameByID(fndID) {
        let res = this.#durations[fndID];
        if (res === undefined) {
            throw 'Durations.getNameByID() error. Unknown ID.';
        }
        return res;
    }
    /**
     * Возвращает массив строк, содержащий все типы продолжительности
     */
    static getAllDurationsArr() {
        return Array.from(this.#durations);
    }
    static get Types() {
        return this.#Types;
    }
}

export class Game {
    _ID = 0;
    _Name = '';
    _MinAmount = undefined;
    _MaxAmount = undefined;
    _Duration = undefined;
    _ActionType = undefined;
    _IsConversational = undefined;
    /**
     * @param {number} setID - ID игры
     * @param {string} setName - Название игры
     * @param {number} setMin - Минимальное количество игроков 
     * @param {number} setMax - Максимальное количество игроков
     * @param {string} setDur - Продолжительность игры (см. класс Durations)
     * @param {string} setActType - Режим\Тип игры (см. класс ActionTypes)
     * @param {boolean} isConversational - Разговорная (по умолчанию false)
     */
    constructor (setID, setName, setMin, setMax, setDur, setActType, isConversational = false) {
        this._ID = setID;
        this._Name = setName;
        this._MinAmount = setMin;
        this._MaxAmount = setMax;
        if (setDur !== undefined)
            this._Duration = Durations.getIDByName(setDur);
        if (setActType !== undefined)
            this._ActionType = ActionTypes.getIDByName(setActType);
        this._IsConversational = isConversational;
    }
    clone() {
        return new Game(this._ID, this._Name, this._MinAmount, this._MaxAmount, this._Duration, this._ActionType, this._IsConversational);
    }
    //#region Gettets && Setters
    get ID() {
        return this._ID;
    }
    get Name() {
        return this._Name;
    }
    /**
     * @param {string} newName
     */
    set Name(newName) {
        this._Name = newName;
    }
    get MinAmount() {
        return this._MinAmount;
    }
    /**
     * @param {number} newMin
     */
    set MinAmount(newMin) {
        this._MinAmount = newMin;
    }
    get MaxAmount() {
        return this._MaxAmount;
    }
    /**
     * @param {number} newMax
     */
    set MaxAmount(newMax) {
        this._MaxAmount = newMax;
    }
    get Duration() {
        return Durations.getNameByID(this._Duration);
    }
    /**
     * @param {string} newDuration
     */
    set Duration(newDuration) {
        this._Duration = Durations.getIDByName(newDuration);
    }
    get ActionType() {
        return ActionTypes.getNameByID(this._ActionType);
    }
    /**
     * @param {string} newActionType
     */
    set ActionType(newActionType) {
        this._ActionType = ActionTypes.getIDByName(newActionType);
    }
    get IsConversational() {
        return this._IsConversational;
    }
    /**
     * @param {boolean} newConver
     */
    set IsConversational(newConver) {
        this._IsConversational = newConver;
    }
    //#endregion
    toString() {
        return '\t\t\'' + this._Name + '\'\nМин. кол-во\t\t' + this._MinAmount + '\nМакс. кол-во:\t\t' + 
                this._MaxAmount + '\nПродолжительность:\t' + this.Duration + '\nТип:\t\t\t' +
                this.ActionType + '\nРазговорная:\t\t' + (this._IsConversational ? 'Да' : 'Нет');
    }
    toJSON() {
        return {
            ID: this._ID,
            Name: this._Name,
            MinAmount: this._MinAmount,
            MaxAmount: this._MaxAmount,
            Duration: Durations.getNameByID(this._Duration),
            ActionType: ActionTypes.getNameByID(this._ActionType),
            IsConversational: this._IsConversational
        }
    }
}

function makeGameArr(resArr, games) {
    for (let i = 0; i < games.length; ++i) {
        resArr.push(new Game(games[i].ID, 
            games[i].Name,
            games[i].MinAmount,
            games[i].MaxAmount,
            games[i].Duration,
            games[i].ActionType,
            games[i].IsConversational));
    }
    return resArr;
} 

class GamesBase extends Array {
    /**
     * Формирует массив string, содержащий названия (Game.Name) всех Game, входящих в this
     */
     getNamesArray() {
        let resArr = [];
        this.forEach((val) => {
            resArr.push(val.Name);
        });
        return resArr;
    }
    /**
     * @param {string} fndName Имя для поиска в Games
     */
    getByName(fndName) {
        return this.find((game) => {
            if (game.Name == fndName) {
                return true;
            }
            return false;
        })
    }
    /**
     * @param {number} fndID ID для поиска в Games
     */
    getByID(fndID) {
        return this.find((game) => {
            if (game.ID == fndID) {
                return true;
            }
            return false;
        })
    }
}

export class GamesDatabase extends GamesBase {
    #preferencesLink = undefined;
    #IDCounter = 0;
    // constructor(...games) {
    //     if (games == undefined || games.length == 0) {
    //         super();
    //     }
    //     else {
    //         if (games.length == 1 && (typeof(games[0]) === 'number')) {
    //             super(games[0]);
    //         } else {
    //             let tmpArr = new Array();
    //             makeGameArr(tmpArr, games);
    //             super(...tmpArr);
    //         }
    //     }
    // }
    /**
     * Deep copy! Данные массива arrayLike не будут связаны с данными результирующего массива. Изменение arrayLike не приведёт к изменению результата.
     * @param arrayLike An array-like object to convert to an array.
     * @param mapFn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    static from(arrayLike, mapFn, thisArg) {
        let tmpArr = new GamesDatabase();
        makeGameArr(tmpArr, arrayLike);
        if (mapFn != undefined) {
            tmpArr.map(mapFn, thisArg);
        }
        return tmpArr;
    }
    static fromJSONobject(jsonObj) {
        let result = GamesDatabase.from(jsonObj.data);
        result.#IDCounter = jsonObj.IDCounter;
        return result;
    }
    /**
     * Связывает объект Games с объектом Preferences. При наличии связи изменения в Games будут распространяться на Preferences.
     * (при удалении игры, она будет удаляться и из Preferences)
     * Если ничего не понял - не используй этот метод. Он технический и нужен для технических нужд.
     * @param {Preferences} prefObj Объект Preferences для связи.
     */
    bindPreferences(prefObj)
    {
        if (prefObj instanceof Preferences) {
            this.#preferencesLink = prefObj;
        } else {
            throw 'GamesDatabase.bindPreferences() error. Input value (prefObj) is not a Preferences object.';
        }
    }
    /**
     * Проверяет связь this с Preferences
     * @returns {boolean} - true если объект связан с Preferences и false в ином случае
     */
    isLinked() {
        if (this.#preferencesLink === undefined) {
            return false;
        }
        return true;
    }
    addGame(gName, gMin = undefined, gMax = undefined, gDur = undefined, gActType = undefined, gIsConversational = undefined) {
        if (gName === undefined || gName === '') {
            throw 'Games.addGame() error. Game name can\'t be undefined or empty!';
        }
        if (!this.isLinked()) {
            throw 'Games.addGame() error. Can\'t add Game without preferencesLink. Please bind this to propper Prefereces object.';
        }
        let retID = this.#IDCounter;
        this.#IDCounter += 1;
        super.push(new Game(retID, gName, gMin, gMax, gDur, gActType, gIsConversational));
        this.#preferencesLink.connectGameWithAll(retID);
        return retID;
    }
    deleteGame(gID) {
        if (!this.isLinked()) {
            throw 'Games.deleteGame() error. Can\'t delete Game without preferencesLink. Please bind this to propper Prefereces object.';
        }
        let fndIndex = this.findIndex((val) => {return val.ID == gID});
        if (fndIndex != -1) {
            let deletionRes = this.splice(fndIndex, 1);
            this.#preferencesLink.deleteAllWithGame(gID);
        }
        else {
            throw 'Games.deleteGame() error. Game with input ID doesn\'t exist.';
        }
    }
    //#region Filters
    filter(predicate, thisArg) {
        return GamesList.from(this, super.filter(predicate, thisArg));
    }
    /**
     * Фильтрует Games по значению поля IsConversational. Возвращает новый объект Games с результатами фильтрации.
     * Deep copy! Новый объект Games не будет связан с объектом this. Изменения this\нового объекта не приведут к
     * изменениям нового объекта\this.
     * @param {boolean} isConversState Games с этим значением IsConversational будут добавлены в результирующий массив
     */
    getAllWithIsConvers(isConversState = true) {
        return this.getAllWith(isConversState, undefined, undefined, undefined);
    }
    /**
     * Фильтрует Games по значению поля Duration. Возвращает новый объект Games с результатами фильтрации.
     * Deep copy! Новый объект Games не будет связан с объектом this. Изменения this\нового объекта не приведут к
     * изменениям нового объекта\this.
     * @param {string} srchDur Games с этим значением Duration будут добавлены в результирующий массив
     */
    getAllWithDuration(srchDur) {
        return this.getAllWith(undefined, srchDur, undefined, undefined);
    }
    /**
     * Фильтрует Games по значению поля ActionType. Возвращает новый объект Games с результатами фильтрации.
     * Deep copy! Новый объект Games не будет связан с объектом this. Изменения this\нового объекта не приведут к
     * изменениям нового объекта\this.
     * @param {string} srchType Games с этим значением ActionType будут добавлены в результирующий массив
     */
    getAllWithActionType(srchType) {
        return this.getAllWith(undefined, undefined, srchType, undefined);
    }
    /**
     * Фильтрует Games по значению полей MinAmount и MaxAmount. Возвращает новый объект Games с результатами фильтрации.
     * Deep copy! Новый объект Games не будет связан с объектом this. Изменения this\нового объекта не приведут к
     * изменениям нового объекта\this.
     * @param {number} srchAmount Games c MinAmount <= srchAmount <= MaxAmount будут добавлены в результирующий массив
     */
    getAllWithAmount(srchAmount) {
        return this.getAllWith(undefined, undefined, undefined, srchAmount);
    }
    /**
     * Фильтрует Games по значению полей IsConversational, Duration, ActionType. Возвращает новый объект Games с результатами фильтрации.
     * Deep copy! Новый объект Games не будет связан с объектом this. Изменения this\нового объекта не приведут к
     * изменениям нового объекта\this.
     * @param {boolean} srchConvers Games с этим значением IsConversational будут добавлены в результирующий массив
     * @param {string} srchDur Games с этим значением Duration будут добавлены в результирующий массив
     * @param {string} srchType Games с этим значением ActionType будут добавлены в результирующий массив
     * @param {number} srchAmount Games с MinAmount <= srchAmount <= MaxAmount будут добавлены в результирующий массив
     */
    getAllWith(srchConvers = undefined, srchDur = undefined, srchType = undefined, srchAmount = undefined) {
        let srchActionID = undefined;
        let srchDurID = undefined;
        if (srchType !== undefined)
            srchActionID = ActionTypes.getIDByName(srchType);
        if (srchDur !== undefined)
            srchDurID = Durations.getIDByName(srchDur);
        return this.filter((val) => {
                let state = true;
                if (srchConvers !== undefined)
                    state = val.IsConversational == srchConvers;
                if (srchDurID !== undefined)
                    state = state && (val._Duration == srchDurID);
                if (srchActionID !== undefined)
                    state = state && (val._ActionType == srchActionID);
                if (srchAmount !== undefined)
                    state = state && ((val.MinAmount <= srchAmount) && (val.MaxAmount >= srchAmount));
                return state;
            });
    }
    //#endregion
    getAll() {
        return GamesList.from(this, this);
    }
    /**
     * Создаёт JSON представление объекта Games в формате: {"games": [{this[0]}, ..., {this[this.length]}]}
     */
    toJSON() {
        return { Games: {
                            data: Array.from(this),
                            IDCounter: this.#IDCounter
                        }
                }
    }
}

export class GamesList extends GamesBase {
    #linkToModel = undefined;
    static get [Symbol.species]() { return Array; };
    constructor(modelLink, ...data) {
        if (modelLink === undefined || !(modelLink instanceof GamesDatabase)) {
            throw 'GamesList.constructor() error. Object must be linked to propper GamesDatabase object.';
        }
        super(...data);
        this.#linkToModel = modelLink;
    }
    static from(modelLink, arrayLike, mapFn, thisArg) {
        let tmpArr = new GamesList(modelLink);
        makeMemberArr(tmpArr, arrayLike);
        if (mapFn !== undefined) {
            tmpArr.map(mapFn, thisArg);
        }
        return tmpArr;
    }
    filter(predicate, thisArg) {
        return GamesList.from(this.#linkToModel, super.filter(predicate, thisArg));
    }
    includeByID(gameID) {
        let includingGame = this.#linkToModel.getByID(gameID);
        if (includingGame === undefined) {
            throw 'GamesList.includeByID() error. Invalid input ID.';
        }
        return this.push(includingGame.clone());
    }
    excludeByID(gameID) {
        for (let i = 0; i < this.length; ++i) {
            if (this[i].ID == gameID) {
                this.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    includeByName(gameName) {
        let includingGame = this.#linkToModel.getByName(gameName);
        if (includingGame === undefined) {
            throw 'GamesList.includeByName() error. Invalid input name.';
        }
        return this.push(includingGame.clone());
    }
    excludeByName(gameName) {
        let excludingGame = this.#linkToModel.getByName(gameName);
        if (excludingGame === undefined) {
            return false;
        }
        let gameID = excludingGame.ID;
        return this.excludeByID(gameID);
    }
}

//#endregion
//#region Preferences
function prefLvlWithin2(val) {
    let res = val;
    if (res >= 3) {
        res = 2;
    } else if (res < 0) {
        res = 0;
    }
    return res;
}
export class Preference {
    _MemberID = 0;
    _GameID = 0;
    _Level = 0;
    constructor(setMemberID, setGameID, setLevel) {
        this._MemberID = setMemberID;
        this._GameID = setGameID;
        if (typeof(setLevel) !== 'number') {
            throw 'Preference.constructor() error. Type of setLevel must be \'number\'.'
        }
        this._Level = prefLvlWithin2(setLevel);
    }
    get MemberID() {
        return this._MemberID;
    }
    set MemberID(memberID) {
        this._MemberID = memberID;
    }
    get GameID() {
        return this._GameID;
    }
    set GameID(gameID) {
        this._GameID = gameID;
    }
    get Level() {
        return this._Level;
    }
    set Level(level) {
        this._Level = prefLvlWithin2(level);
    } 
    toJSON() {
        return {
            MemberID: this._MemberID,
            GameID: this._GameID,
            Level: this._Level
        }
    }
}
function makePreferenceArr(resArr, preferences) {
    for (let i = 0; i < preferences.length; ++i) {
        resArr.push(new Preference(preferences[i].MemberID, 
            preferences[i].GameID,
            preferences[i].Level,));
    }
    return resArr;
}
export class Preferences extends Array {
    #MembersLink = undefined;
    #GamesLink = undefined;
    constructor(...preferences) {
        if (preferences == undefined || preferences.length == 0) {
            super();
        }
        else {
            if (preferences.length == 1 && (typeof(preferences[0]) === 'number')) {
                super(preferences[0]);
            } else {
                let tmpArr = new Array();
                makePreferenceArr(tmpArr, preferences);
                super(...tmpArr);
            }
        }
    }
    /**
     * Deep copy! Данные массива arrayLike не будут связаны с данными результирующего массива. Изменение arrayLike не приведёт к изменению результата.
     * @param arrayLike An array-like object to convert to an array.
     * @param mapFn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    static from(arrayLike, mapFn, thisArg) {
        let tmpArr = new Preferences();
        makePreferenceArr(tmpArr, arrayLike);
        if (mapFn != undefined) {
            tmpArr.map(mapFn, thisArg);
        }
        return tmpArr;
    }
    static fromJSONobject(jsonObj) {
        return Preferences.from(jsonObj);
    }
    /**
     * Связывает объект Preferences с объектом Members. При наличии связи изменения в Preferences будут согласованы с Members.
     * (при вставке новых данных в Preference будет происходить проверка: существует ли такой MemberID в Members)
     * Если ничего не понял - не используй этот метод. Он технический и нужен для технических нужд.
     * @param {MembersDatabase} membersObj Объект Members для связи.
     */
    bindMembers(membersObj) {
        if (membersObj instanceof MembersDatabase) {
            this.#MembersLink = membersObj;
        } else {
            throw 'Preferences.bindMembers() error. Input value (membersObj) is not a MembersDatabase object.';
        }
    }
    /**
     * Проверяет связь this с Members
     * @returns {boolean} - true если объект связан с Members и false в ином случае
     */
    isLinkedMembers() {
        if (this.#MembersLink === undefined) {
            return false;
        }
        return true;
    }
    /**
     * То же, что и Preferences.bindMembers() только для GamesID. См. описание там.
     * @param {Games} gamesObj Объект Games для связи.
     */
    bindGames(gamesObj) {
        if (gamesObj instanceof GamesDatabase) {
            this.#GamesLink = gamesObj;
        } else {
            throw 'Preferences.bindGames() error. Input value (gamesObj) is not a GamesDatabase object.';
        }
    }
    /**
     * Проверяет связь this с Games
     * @returns {boolean} - true если объект связан с Games и false в ином случае
     */
    isLinkedGames() {
        if (this.#GamesLink === undefined) {
            return false;
        }
        return true;
    }
    #deleteAllWith(fndFunc) {
        for (let i = 0; i < this.length; ++i) {
            if (fndFunc(this[i])) {
                this.splice(i, 1);
                i -= 1;
            }
        } 
    }
    connectMemberWithAll(memberID, prefLevel = 1) {
        if (this.isLinkedGames() && this.isLinkedMembers()) {
            if (this.#MembersLink.getByID(memberID) !== undefined) {
                for (let game of this.#GamesLink) {
                    this.push(new Preference(memberID, game.ID, prefLevel));
                }
            } else {
                throw 'Preferences.connectMemberWithAll() error. Invalid memberID.';
            }
        } else {
            if (this.isLinkedGames()) {
                throw 'Preferences.connectMemberWithAll() error. Missing Games object link. Please use bindGames() with propper Games object first.';
            } else {
                throw 'Preferences.connectMemberWithAll() error. Missing Members object link. Please use bindMembers() with propper Members object first.';
            }
        }
    }
    /**
     * Удаляет все элементы, удовлетворяющие предикату, из Preferences
     * @param {function(val)} fndFunc - предикат, определяющий удаляемый элемент. Если предикат вернул true - элемент будет удалён
     */  
    deleteAllWithMember(memberID) {
        this.#deleteAllWith((val) => {
            return val.MemberID == memberID;
        });
    }
    connectGameWithAll(gameID, prefLevel = 1) {
        if (this.isLinkedGames() && this.isLinkedMembers()) {
            if (this.#GamesLink.getByID(gameID) !== undefined) {
                for (let member of this.#MembersLink) {
                    this.push(new Preference(member.ID, gameID, prefLevel));
                }
            } else {
                throw 'Preferences.connectGameWithAll() error. Invalid gameID.';
            }
        } else {
            if (this.isLinkedGames()) {
                throw 'Preferences.connectGameWithAll() error. Missing Games object link. Please use bindGames() with propper Games object first.';
            } else {
                throw 'Preferences.connectGameWithAll() error. Missing Members object link. Please use bindMembers() with propper Members object first.';
            }
        }
    }
    deleteAllWithGame(gameID) {
        this.#deleteAllWith((val) => {
            return val.GameID == gameID;
        });
    }
    addPreference(memberID, gameID, prefLevel = 1) {
        if (this.#GamesLink === undefined || this.#MembersLink === undefined) {
            throw 'Preferences.addPreference() error. Preferences must be binded with Members and Games objects. Can\'t add new data without bind operations.';
        }
        if (this.#MembersLink.getByID(memberID) === undefined) {
            throw 'Preferences.addPreference() error. Invalid memberID.'
        }
        if (this.#GamesLink.getByID(gameID) === undefined) {
            throw 'Preferences.addPreference() error. Invalid gameID.'
        }
        this.push(new Preference(memberID, gameID, prefLevel));
    }
    deletePreference(memberID, gameID) {
        if (memberID === undefined || gameID === undefined) {
            throw 'Prefernces.deletePreference() error. Input ID\'s must be defined.';
        }
        for (let i = 0; i < this.length; ++i) {
            if (this[i].MemberID === memberID && this[i].GameID === gameID) {
                this.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    toJSON() {
        return { Preferences: Array.from(this) };
    }
}
//#endregion
export class Database {
    _Members = new MembersDatabase();
    _Games = new GamesDatabase();
    _Preferences = new Preferences();
    constructor(filename = 'database.json') {
        let rawData = JSON.parse(fs.readFileSync('./Database/' + filename));
        if (rawData !== undefined) {
            this._Members = MembersDatabase.fromJSONobject(rawData[0].Members);
            this._Games = GamesDatabase.fromJSONobject(rawData[1].Games);
            this._Preferences = Preferences.fromJSONobject(rawData[2].Preferences);
            this._Members.bindPreferences(this._Preferences);
            this._Games.bindPreferences(this._Preferences);
            this._Preferences.bindMembers(this._Members);
            this._Preferences.bindGames(this._Games);
        } else {
            throw 'Database.constructor() error. Can\'t read file.';
        }
    }
    get Members() {
        return this._Members;
    }
    get Games() {
        return this._Games;
    }
    get Preferences() {
        return this._Preferences;
    }
    save(filename = 'database.json') {
        fs.writeFileSync('./Database/' + filename, JSON.stringify(this, null, '\t'));
    }
    toJSON() {
        return [this._Members, this._Games, this._Preferences];
    }
}