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
/**
 * Класс - модель для представления данных об участнике.
 */
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
     * Создаёт объект участника с заданными параметрами.
     * @param {number} setID ID участника
     * @param {string} setName имя участника
     * @param {string} setSurname фамилия участника
     * @param {string} setNickname кличка участника
     * @param {string} setTelegramID TelegramID участника
     * @param {string} setBirthDate дата рождения участника
     * @param {string} setBirthdayGroupID ID Телеграм беседы для планирования ДР участника
     * @param {boolean} setIsActive статус (активен или нет)
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
    /**
     * Создаёт глубокую копию объекта Member.
     * @returns {Member} копия объекта this
     */
    clone() {
        return new Member(this._ID, this._Name, this._Surname, this._Nickname, this._TelegramID, this._BirthDate, this._BirthdayGroupID, this._IsActive);
    }
    //#region Getters && Setters
    /**
     * @returns {number} ID участника
     */
    get ID() {
        return this._ID;
    }
    /**
     * @returns {string} имя участника
     */
    get Name() {
        return this._Name;
    }
    /**
     * Задаёт участнику имя
     * @param {string} newName строка с новым именем
     */
    set Name(newName) {
        this._Name = newName;
    }
    /**
     * @returns {string} фамилия участника
     */
    get Surname() {
        return this._Surname;
    }
    /**
     * Задаёт участнику фамилию
     * @param {string} newSurname строка с новой фамилией
     */
    set Surname(newSurname) {
        this._Surname = newSurname;
    }
    /**
     * @returns {string} кличка участника
     */
    get Nickname() {
        return this._Nickname;
    }
    /**
     * @param {string} newNickname строка с новой кличкой участника
     */
    set Nickname(newNickname) {
        this._Nickname = newNickname;
    }
    /**
     * @returns {string} TelegramID участника
     */
    get TelegramID() {
        return this._TelegramID;
    }
    /**
     * @param {string} TelegramID - строка с новым TelegramID
     */
    set TelegramID(newTelegramID) {
        this._TelegramID = newTelegramID;
    }
    /**
     * @returns {string} строка с датой рождения участника
     */
    get BirthDate() {
        return this._BirthDate;
    }
    /**
     * @param {string} BirthDate - строка с новой датой рождения
     */
    set BirthDate(newBirthDate) {
        this._BirthDate = newBirthDate;
    }
    /**
     * @returns {string} строка с TelegramID группы для планирования ДР участника
     */
    get BirthdayGroupID() {
        return this._BirthdayGroupID;
    }
    /**
     * @param {string} groupID - строка с новым TelegramID группы для планирования ДР
     */
    set BirthdayGroupID(groupID) {
        this._BirthdayGroupID = groupID;
    }
    /**
     * @returns {boolean} статус участника
     */
    get IsActive() {
        return this._IsActive;
    }
    /**
     * @param {boolean} IsActive новый статус участника
     */
    set IsActive(newIsActive) {
        this._IsActive = newIsActive;
    }
    /**
     * Возвращает строку вида: Name + ' ' + Surname
     * @returns {string} полное имя (Имя Фамилия) участника
     */
    get FullName() {
        return this._Name + ' ' + this._Surname;
    }
    //#endregion
    /**
     * Правильно упаковывает this в JSON объект
     * @returns {object} объект для записи в JSON
     */
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

/**
 * Базовый\родительский класс коллекции участников
 */
class MembersBase extends Array {
    /**
     * Ищет и возвращает участника по его кличке.
     * @param {string} fndNickname кличка участника для поиска
     * @returns {Member|undefined} участник с искомым NickName или undefined если такого нет
     */
    getByNickname(fndNickname) {
        return this.find((member) => {
            if (member.Nickname === fndNickname) {
                return true;
            }
            return false;
        });
    }
    /**
     * Ищет и возвращает участника по его полному имени (Name + ' ' + Surname).
     * @param {string} fndFullName полное имя участника для поиска
     * @returns {Member|undefined} участник с искомым полным именем или undefined если такого нет
     */
    getByFullName(fndFullName) {
        return this.find((member) => {
            if (member.FullName === fndFullName) {
                return true;
            }
            return false;
        });
    }
    /**
     * Ищет и возвращает участника по его ID.
     * @param {number} fndID ID участника для поиска
     * @returns {Member|undefined} участник с искомым ID или undefined если такого нет
     */
    getByID(fndID) {
        return this.find((member, ind, obj) => {
            if (member.ID == fndID) {
                return true;
            }
            return false;
        });
    }
    /**
     * Ищет и возвращает участника по его TelegramID
     * @param {string} fndID TelegramID участника для поиска
     * @returns {Member|undefined} участник с искомым TelegramID или undefined если такого нет
     */
    getByTlgID(fndID) {
        return this.find((member, ind, obj) => {
            if (member.TelegramID == fndID) {
                return true;
            }
            return false;
        });
    }
    /**
     * Формирует массив имён всех участников в коллекции.
     * Если коллекция пуста, возврващет пустой массив.
     * @returns {[string]} массив string c именами участников
     */
    getNamesArray() {
        let resArr = new Array();
        this.forEach((val) => {
            resArr.push(val.Name);
        });
        return resArr;
    }
}
/**
 * Класс для управления данными участников с соблюдением целостности
 */
class MembersDatabase extends MembersBase {
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
     * Метод пытается сформировать новый объект MembersDatabase на основе входного массива.
     * Если данные входного массива содержат объекты, отличные по структуре от Member, создаст участника с undefined полями.
     * @param {Array} arrayLike массивоподобный объект для формирования нового объекта MembersDatabase
     * @param {function (any, number, array)} mapFn функция для выполнения Array.map() над создаваемым массивом
     * @param {any} thisArg ссылка на this (предусмотрена стандартом языка, можно оставлять undefined)
     * @returns {MembersDatabase} новый объект на основе входного массива
     */
    static from(arrayLike, mapFn, thisArg = undefined) {
        let tmpArr = new MembersDatabase();
        makeMemberArr(tmpArr, arrayLike);
        if (mapFn != undefined) {
            tmpArr.map(mapFn, thisArg);
        }
        return tmpArr;
    }
    /**
     * Метод преобразует JSON объект в MembersDatabase.
     * Ожидается, что JSON объект будет соответствовать по структуре классу MembersDatabase (см. MembersDatabase.toJSON())
     * @param {object} jsonObj JSON объект, содержащий данные в виде массива Member
     * @returns {MembersDatabase} объект сформированный на основе данных JSON
     */
    static fromJSONobject(jsonObj) {
        let result = MembersDatabase.from(jsonObj.data);
        result.#IDCounter = jsonObj.IDCounter;
        return result;
    }
    /**
     * Связывает объект MembersDatabase с объектом Preferences. При наличии связи изменения в Members будут распространяться на Preferences.
     * (Если ничего не понял - не используй этот метод. Он технический и нужен для технических нужд.)
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
     * Проверяет связь this с Preferences.
     * @returns {boolean} - true если объект связан с Preferences и false в ином случае
     */
    isLinked() {
        if (this.#preferencesLink === undefined) {
            return false;
        }
        return true;
    }
    /**
     * Добавляет нового участника в MembersDatabase. Возвращает ID созданного участника.
     * При наличии связи с объектом Preferences, вызывает метод Preferences.connectMemberWithAll(ID нового участника).
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
    /**
     * Удаляет участника из MembersDatabase.
     * При наличии связи с объектом Preferences, вызывает метод Preferences.deleteAllWithMember(ID удаляемого участника).
     * @param {number} mID ID удаляемого участника 
     */
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
    /**
     * Фильтрует содержимое коллекции и создаёт новый объект MembersList, содержащий все элементы, удовлетворяющие условию предиката.
     * @param {function(Member, number, Array)} predicate предикат, фильтрующий элементы
     * @param {any} thisArg ссылка на this (есть в стандарте языка), можно оставлять undefined
     * @returns {MembersList} новый объект MemberList с результатами фильтрации
     */
    filter(predicate, thisArg = undefined) {
        return MembersList.from(this, super.filter(predicate, thisArg));
    }
    /**
     * Обёртка над методом filter. Фильтрует участников по полю активности.
     * @param {boolean} isActiveState участники с этим значением IsActive войдут в коллекцию результирующего объекта MembersList
     * @returns {MembersList} новый объект MembersList с результатами фильтрации
     */
    getAllWithIsActive(isActiveState = true) {
        return this.filter((val) => {return val.IsActive == isActiveState});
    }
    /**
     * Создаёт новый объект MembersList без применения фильтра.
     * @returns {MembersList} новый объект MembersList, полная копия this по составу
     */
    getAll() {
        return MembersList.from(this, this);
    }
    /**
     * Создаёт JSON представление объекта MembersDatabase в формате: {"Members": [{this[0]}, ..., {this[this.length]}], IDCounter}
     * @returns {object} объект для записи в JSON
     */
    toJSON() {
        return { Members: {
                            data: Array.from(this),
                            IDCounter: this.#IDCounter
                        }
            };
    }
}
/**
 * Класс, представляющий список участников. Изменения в списке не распространяются на другие объекты и на файл JSON.
 * Может хранить только уже существующих участников (т.е. не может создать\удалить нового участника).
 * По сути это просто массив объектов Member с "плюшками" в виде настроенных методов для фильтрации.
 */
export class MembersList extends MembersBase {
    #linkToModel = undefined;
    // переопределение прототипа. Все методы генерирующие новый объект из исходного будут создавать объекты типа Array
    static get [Symbol.species]() { return Array; }
    /**
     * Для создания и нормальной работы объекта MembersList требуется ссылка на заполненный объект MembersDatabase.
     * @param {MembersBase} modelLink ссылка на объект из БД
     * @param  {...any} data объект или объекты, которые войдут в коллекцию создаваемого MembersList
     */
    constructor(modelLink, ...data) {
        if (modelLink === undefined || !(modelLink instanceof MembersDatabase)) {
            throw 'MembersList.constructor() error. Object must be linked to propper MembersDatabase object.';
        }
        super(...data);
        this.#linkToModel = modelLink;
    }
    /**
     * Метод пытается сформировать новый объект MembersList на основе входного массива.
     * Если данные входного массива содержат объекты, отличные по структуре от Member, создаст участника с undefined полями.
     * @param {MembersDatabase} ссылка на заполненный объект БД
     * @param {Array} arrayLike массивоподобный объект для формирования нового объекта MembersList
     * @param {function (any, number, array)} mapFn функция для выполнения Array.map() над создаваемым массивом
     * @param {any} thisArg ссылка на this (предусмотрена стандартом языка, можно оставлять undefined)
     * @returns {MembersList} новый объект на основе входного массива
     */
    static from(modelLink, arrayLike, mapFn, thisArg = undefined) {
        let tmpArr = new MembersList(modelLink);
        makeMemberArr(tmpArr, arrayLike);
        if (mapFn !== undefined) {
            tmpArr.map(mapFn, thisArg);
        }
        return tmpArr;
    }
    /**
     * Фильтрует содержимое коллекции и создаёт новый объект MembersList, содержащий все элементы, удовлетворяющие условию предиката.
     * @param {function(Member, number, Array)} predicate предикат, фильтрующий элементы
     * @param {any} thisArg ссылка на this (есть в стандарте языка), можно оставлять undefined
     * @returns {MembersList} новый объект MemberList с результатами фильтрации
     */
    filter(predicate, thisArg) {
        return MembersList.from(this.#linkToModel, super.filter(predicate, thisArg));
    }
    /**
     * Добавляет в конец списка уже существующего в БД участника по его ID.
     * Если ID не будет найден в БД, выбросит исключение. 
     * @param {number} memberID ID участника для добавления
     * @returns {number} новая длина коллекции после вставки
     */
    includeByID(memberID) {
        let includingMember = this.#linkToModel.getByID(memberID);
        if (includingMember === undefined) {
            throw 'MembersList.includeByID() error. Invalid input ID.';
        }
        return this.push(includingMember.clone());
    }
    /**
     * Исключает участника из коллекции. Исключение участника не приведёт к его удалению из БД.
     * Если участник с указанным ID не будет найден, вернет false.
     * @param {number} memberID ID участника для исключения
     * @returns {boolean} true - удаление успешно, false - удаление не было выполнено (участник не был найден)
     */
    excludeByID(memberID) {
        for (let i = 0; i < this.length; ++i) {
            if (this[i].ID == memberID) {
                this.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    /**
     * То же, что и includeByID, только добавление происходит по FullName участника.
     * @param {string} fullname полное имя участника в формате Name + ' ' + Surname 
     * @returns {number} новая длина коллекции после вставки
     */
    includeByFullName(fullname) {
        let includingMember = this.#linkToModel.getByFullName(fullname);
        if (includingMember === undefined) {
            throw 'MembersList.includeByFullName() error. Invalid input name.';
        }
        return this.push(includingMember.clone());
    }
    /**
     * То же, что и excludeByID, только исключение происходит по FullName участника
     * @param {string} fullname полное имя участника в формате Name + ' ' + Surname
     * @returns {boolean} true - удаление успешно, false - удаление не было выполнено (участник не был найден)
     */
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
/**
 * Класс-справочник типов действия игры (кооп, синглплеер, командная).
 * Только статические методы и поля. Создание экземпляров(объектов) не подразумевается.
 */
export class ActionTypes {
    static #types = ['Кооперативная', 'Командная', 'Каждый сам за себя'];
    static #Types = {coop: this.#types[0], teams: this.#types[1], single: this.#types[2]};
    /**
     * Возвращает ID типа игры по его названию.
     * @param {string} fndName строка с названием типа
     * @returns {number} ID типа игры
     */
    static getIDByName(fndName) {
        let res = this.#types.findIndex((val) => {return val == fndName});
        if (res == -1) {
            throw 'ActionTypes.getIDByName() error. Unknown name.';
        }
        return res;
    }
    /**
     * Возвращает название типа игры по его ID.
     * @param {number} fndID ID типа игры
     * @returns {string} название искомого типа
     */
    static getNameByID(fndID) {
        let res = this.#types[fndID];
        if (res === undefined) {
            throw 'ActionTypes.getNameByID() error. Unknown ID.';
        }
        return res;
    }
    /**
     * Возвращает массив строк, содержащий все названия типов игры.
     * @returns {[string]} массив строк, со всеми типами
     */
    static getAllTypesArr() {
        return Array.from(this.#types);
    }
    /**
     * getter для доступа к сокращениям типов при написании кода.
     * Возвращает объект с полями coop, teams, single.
     */
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
/**
 * Класс-справочник типов длительности игры (быстрая, средняя, долгая).
 * Только статические методы и поля. Создание экземпляров(объектов) не подразумевается.
 */
export class Durations {
    static #durations = ['Быстрая', 'Средняя', 'Долгая'];
    static #Types = {fast: this.#durations[0], average: this.#durations[1], long: this.#durations[2]};
    /**
     * Возвращает ID продолжительности игры по её названию.
     * @param {string} fndName строка с названием продолжительности
     * @returns {number} ID продолжительности игры
     */
    static getIDByName(fndName) {
        let res = this.#durations.findIndex((val) => {return val == fndName});
        if (res == -1) {
            throw 'Durations.getIDByName() error. Unknown name.';
        }
        return res;
    }
    /**
     * Возвращает название продолжительности по её ID.
     * @param {number} fndID ID продолжительности
     * @returns {string} название продолжительности
     */
    static getNameByID(fndID) {
        let res = this.#durations[fndID];
        if (res === undefined) {
            throw 'Durations.getNameByID() error. Unknown ID.';
        }
        return res;
    }
    /**
     * Возвращает массив строк, содержащий все названия продолжительностей игры.
     * @returns {[string]} массив строк, со всеми продолжительностями
     */
    static getAllDurationsArr() {
        return Array.from(this.#durations);
    }
    /**
     * getter для доступа к сокращениям продолжительностей при написании кода.
     * Возвращает объект с полями fast, average, long.
     */
    static get Types() {
        return this.#Types;
    }
}
/**
 * Класс - модель для представления данных об игре
 */
export class Game {
    _ID = 0;
    _Name = '';
    _MinAmount = undefined;
    _MaxAmount = undefined;
    _Duration = undefined;
    _ActionType = undefined;
    _IsConversational = undefined;
    /**
     * Создаёт объект игры с заданными параметрами
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
    /**
     * Создаёт глубокую копию объекта Game.
     * @returns {Game} копия объекта this
     */
    clone() {
        return new Game(this._ID, this._Name, this._MinAmount, this._MaxAmount, this._Duration, this._ActionType, this._IsConversational);
    }
    //#region Gettets && Setters
    /**
     * @returns {number} ID игры
     */
    get ID() {
        return this._ID;
    }
    /**
     * @returns {string} название игры
     */
    get Name() {
        return this._Name;
    }
    /**
     * Задаёт игре название.
     * @param {string} newName строка с новым названием
     */
    set Name(newName) {
        this._Name = newName;
    }
    /**
     * @returns {number} минимальное количество игроков
     */
    get MinAmount() {
        return this._MinAmount;
    }
    /**
     * Задаёт минимальное количество игроков для игры.
     * @param {number} newMin новое значение минимального количества игроков
     */
    set MinAmount(newMin) {
        this._MinAmount = newMin;
    }
    /**
     * @returns {number} максимальное количество игроков
     */
    get MaxAmount() {
        return this._MaxAmount;
    }
    /**
     * Задаёт максимальное количество игроков для игры.
     * @param {number} newMax новое значение максимального количества игроков
     */
    set MaxAmount(newMax) {
        this._MaxAmount = newMax;
    }
    /**
     * @returns {string} название продолжительности игры
     */
    get Duration() {
        return Durations.getNameByID(this._Duration);
    }
    /**
     * Задаёт продолжительность игры.
     * @param {string} newDuration новое значение продолжительности игры
     */
    set Duration(newDuration) {
        this._Duration = Durations.getIDByName(newDuration);
    }
    /**
     * @returns {string} название типа действия игры
     */
    get ActionType() {
        return ActionTypes.getNameByID(this._ActionType);
    }
    /**
     * Задаёт тип действия игры.
     * @param {string} newActionType новое значение типа действия игры
     */
    set ActionType(newActionType) {
        this._ActionType = ActionTypes.getIDByName(newActionType);
    }
    /**
     * @returns {boolean} разговорная игра или нет
     */
    get IsConversational() {
        return this._IsConversational;
    }
    /**
     * Задаёт тип игры: разговорная или нет.
     * @param {boolean} newConver новое значение типа игры
     */
    set IsConversational(newConver) {
        this._IsConversational = newConver;
    }
    //#endregion
    // toString() {
    //     return '\t\t\'' + this._Name + '\'\nМин. кол-во\t\t' + this._MinAmount + '\nМакс. кол-во:\t\t' + 
    //             this._MaxAmount + '\nПродолжительность:\t' + this.Duration + '\nТип:\t\t\t' +
    //             this.ActionType + '\nРазговорная:\t\t' + (this._IsConversational ? 'Да' : 'Нет');
    // }
    /**
     * Правильно упаковывает this в JSON объект
     * @returns {object} объект для записи в JSON
     */
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
/**
 * Базовый\родительский класс коллекции игр
 */
class GamesBase extends Array {
    /**
     * Формирует массив имён всех игр в коллекции.
     * Если коллекция пуста, возврващет пустой массив.
     * @returns {[string]} массив string c названиями игр
     */
    getNamesArray() {
        let resArr = [];
        this.forEach((val) => {
            resArr.push(val.Name);
        });
        return resArr;
    }
    /**
     * Ищет и возвращает игру по её названию.
     * @param {string} fndName название игры для поиска
     * @returns {Game|undefined} игра с искомым названием или undefined если игры с таким названием в коллекции нет
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
     * Ищет и возвращает игру по её ID.
     * @param {number} fndID ID игры для поиска
     * @returns {Game|undefined} игра с искомым ID или undefined если такой нет
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
/**
 * Класс для управления данными игр с соблюдением целостности
 */
class GamesDatabase extends GamesBase {
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
     * Метод пытается сформировать новый объект GamesDatabase на основе входного массива.
     * Если данные входного массива содержат объекты, отличные по структуре от Game, создаст игру с undefined полями.
     * @param {Array} arrayLike массивоподобный объект для формирования нового объекта GamesDatabase
     * @param {function (any, number, array)} mapFn функция для выполнения Array.map() над создаваемым массивом
     * @param {any} thisArg ссылка на this (предусмотрена стандартом языка, можно оставлять undefined)
     * @returns {GamesDatabase} новый объект на основе входного массива
     */
    static from(arrayLike, mapFn, thisArg) {
        let tmpArr = new GamesDatabase();
        makeGameArr(tmpArr, arrayLike);
        if (mapFn != undefined) {
            tmpArr.map(mapFn, thisArg);
        }
        return tmpArr;
    }
    /**
     * Метод преобразует JSON объект в GamesDatabase.
     * Ожидается, что JSON объект будет соответствовать по структуре классу GamesDatabase (см. GamesDatabase.toJSON())
     * @param {object} jsonObj JSON объект, содержащий данные в виде массива Game
     * @returns {GamesDatabase} объект сформированный на основе данных JSON
     */
    static fromJSONobject(jsonObj) {
        let result = GamesDatabase.from(jsonObj.data);
        result.#IDCounter = jsonObj.IDCounter;
        return result;
    }
    /**
     * Связывает объект GamesDatabase с объектом Preferences. При наличии связи изменения в Games будут распространяться на Preferences.
     * (Если ничего не понял - не используй этот метод. Он технический и нужен для технических нужд.)
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
     * Проверяет связь this с Preferences.
     * @returns {boolean} - true если объект связан с Preferences и false в ином случае
     */
    isLinked() {
        if (this.#preferencesLink === undefined) {
            return false;
        }
        return true;
    }
    /**
     * Добавляет новую игру в GamesDatabase. Возвращает ID созданной игры.
     * При наличии связи с объектом Preferences, вызывает метод Preferences.connectGameWithAll(ID новой игры).
     * @param {string} mName - (обязательный параметр) Название игры
     * @param {number} gMin - (необязательный параметр) Минимальное количество игроков
     * @param {number} gMax - (необязательный параметр) Максимальное количество игроков
     * @param {string} gDur - (необязательный параметр) Название типа продолжительности игры
     * @param {string} gActType - (необязательный параметр) Название типа действия игры
     * @param {boolean} gIsConversational - (необязательный параметр) Тип: разговорная или нет
     * @returns {number} ID новой игры
     */
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
    /**
     * Удаляет игру из GamesDatabase.
     * При наличии связи с объектом Preferences, вызывает метод Preferences.deleteAllWithGame(ID удаляемой игры).
     * @param {number} gID ID удаляемой игры
     */
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
    /**
     * Фильтрует содержимое коллекции и создаёт новый объект GamesList, содержащий все элементы, удовлетворяющие условию предиката.
     * @param {function(Game, number, Array)} predicate предикат, фильтрующий элементы
     * @param {any} thisArg ссылка на this (есть в стандарте языка), можно оставлять undefined
     * @returns {GamesList} новый объект GamesList с результатами фильтрации
     */
    filter(predicate, thisArg = undefined) {
        return GamesList.from(this, super.filter(predicate, thisArg));
    }
    /**
     * Обёртка над методом filter. Фильтрует игры по типу: разговорная или нет.
     * @param {boolean} isConversState игры с этим значением IsConversational войдут в коллекцию результирующего объекта GamesList
     * @returns {GamesList} новый объект GamesList с результатами фильтрации
     */
    getAllWithIsConvers(isConversState = true) {
        return this.getAllWith(isConversState, undefined, undefined, undefined);
    }
    /**
     * Обёртка над методом filter. Фильтрует игры по продолжительности.
     * @param {string} srchDur игры с этим значением Duration войдут в коллекцию результирующего объекта GamesList
     * @returns {GamesList} новый объект GamesList с результатами фильтрации
     */
    getAllWithDuration(srchDur) {
        return this.getAllWith(undefined, srchDur, undefined, undefined);
    }
    /**
     * Обёртка над методом filter. Фильтрует игры по типу действия.
     * @param {string} srchType игры с этим значением ActionType войдут в коллекцию результирующего объекта GamesList
     * @returns {GamesList} новый объект GamesList с результатами фильтрации
     */
    getAllWithActionType(srchType) {
        return this.getAllWith(undefined, undefined, srchType, undefined);
    }
    /**
     * Обёртка над методом filter. Фильтрует игры по количеству игроков.
     * @param {number} srchAmount игры для которых верно: MinAmount <= srchAmount <= MaxAmount, войдут в результирующий GamesList
     * @returns {GamesList} новый объект GamesList с результатами фильтрации
     */
    getAllWithAmount(srchAmount) {
        return this.getAllWith(undefined, undefined, undefined, srchAmount);
    }
    /**
     * Обёртка над методом filter. Фильтрует игры по значениям полей IsConversational, Duration, ActionType, Min\Max Amount.
     * Возвращает все игры, если все параметры задать как undefined.
     * @param {boolean} srchConvers Games с этим значением IsConversational будут добавлены в результирующий объект
     * @param {string} srchDur Games с этим значением Duration будут добавлены в результирующий объект
     * @param {string} srchType Games с этим значением ActionType будут добавлены в результирующий объект
     * @param {number} srchAmount Games с MinAmount <= srchAmount <= MaxAmount будут добавлены в результирующий объект
     * @returns {GamesList} новый объект GamesList с результатами фильтрации
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
    /**
     * Создаёт новый объект GamesList без применения фильтра.
     * @returns {GamesList} новый объект GamesList, полная копия this по составу
     */
    getAll() {
        return GamesList.from(this, this);
    }
    /**
     * Создаёт JSON представление объекта GamesDatabase в формате: {"Games": [{this[0]}, ..., {this[this.length]}], IDCounter}
     * @returns {object} объект для записи в JSON
     */
    toJSON() {
        return { Games: {
                            data: Array.from(this),
                            IDCounter: this.#IDCounter
                        }
                }
    }
}
/**
 * Класс, представляющий список игр. Изменения в списке не распространяются на другие объекты и на файл JSON.
 * Может хранить только уже существующие игры (т.е. не может создать\удалить новую игру).
 * По сути это просто массив объектов Game с "плюшками" в виде настроенных методов для фильтрации.
 */
export class GamesList extends GamesBase {
    #linkToModel = undefined;
    // переопределение прототипа. Все методы генерирующие новый объект из исходного будут создавать объекты типа Array
    static get [Symbol.species]() { return Array; };
    /**
     * Для создания и нормальной работы объекта GamesList требуется ссылка на заполненный объект GamesDatabase.
     * @param {GamesDatabase} modelLink ссылка на объект из БД
     * @param  {...any} data объект или объекты, которые войдут в коллекцию создаваемого GamesList
     */
    constructor(modelLink, ...data) {
        if (modelLink === undefined || !(modelLink instanceof GamesDatabase)) {
            throw 'GamesList.constructor() error. Object must be linked to propper GamesDatabase object.';
        }
        super(...data);
        this.#linkToModel = modelLink;
    }
    /**
     * Метод пытается сформировать новый объект GamesList на основе входного массива.
     * Если данные входного массива содержат объекты, отличные по структуре от Game, создаст игру с undefined полями.
     * @param {GamesDatabase} ссылка на заполненный объект БД
     * @param {Array} arrayLike массивоподобный объект для формирования нового объекта GamesDatabase
     * @param {function (any, number, array)} mapFn функция для выполнения Array.map() над создаваемым массивом
     * @param {any} thisArg ссылка на this (предусмотрена стандартом языка, можно оставлять undefined)
     * @returns {GamesDatabase} новый объект на основе входного массива
     */
    static from(modelLink, arrayLike, mapFn, thisArg) {
        let tmpArr = new GamesList(modelLink);
        makeGameArr(tmpArr, arrayLike);
        if (mapFn !== undefined) {
            tmpArr.map(mapFn, thisArg);
        }
        return tmpArr;
    }
    /**
     * Фильтрует содержимое коллекции и создаёт новый объект GamesList, содержащий все элементы, удовлетворяющие условию предиката.
     * @param {function(Game, number, Array)} predicate предикат, фильтрующий элементы
     * @param {any} thisArg ссылка на this (есть в стандарте языка), можно оставлять undefined
     * @returns {GamesList} новый объект GamesList с результатами фильтрации
     */
    filter(predicate, thisArg) {
        return GamesList.from(this.#linkToModel, super.filter(predicate, thisArg));
    }
    /**
     * Добавляет в конец списка уже существующую в БД игру по её ID.
     * Если ID не будет найден в БД, выбросит исключение. 
     * @param {number} gameID ID игры для добавления
     * @returns {number} новая длина коллекции после вставки
     */
    includeByID(gameID) {
        let includingGame = this.#linkToModel.getByID(gameID);
        if (includingGame === undefined) {
            throw 'GamesList.includeByID() error. Invalid input ID.';
        }
        return this.push(includingGame.clone());
    }
    /**
     * Исключает игру из коллекции. Исключение игры не приведёт к её удалению из БД.
     * Если игра с указанным ID не будет найдена, вернет false.
     * @param {number} gameID ID игры для исключения
     * @returns {boolean} true - удаление успешно, false - удаление не было выполнено (игра не была найдена)
     */
    excludeByID(gameID) {
        for (let i = 0; i < this.length; ++i) {
            if (this[i].ID == gameID) {
                this.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    /**
     * То же, что и includeByID, только добавление происходит по Name игры. 
     * @param {string} gameName название игры для добавления
     * @returns {number} новая длина коллекции после вставки
     */
    includeByName(gameName) {
        let includingGame = this.#linkToModel.getByName(gameName);
        if (includingGame === undefined) {
            throw 'GamesList.includeByName() error. Invalid input name.';
        }
        return this.push(includingGame.clone());
    }
    /**
     * То же, что и excludeByID, только исключение происходит по Name игры
     * @param {string} gameName название игры
     * @returns {boolean} true - удаление успешно, false - удаление не было выполнено (игра не была найдена)
     */
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
/**
 * Класс-справочник уровней предпочтения.
 * Только статические методы и поля. Создание экземпляров(объектов) не подразумевается.
 */
export class PreferenceLevel {
    static #levels = ['Никогда не буду играть в неё', 'Не против, но против', 'Норм', 'ДА1!1'];
    static #Levels = {lowest: this.#levels[0], belowaverage: this.#levels[1], average: this.#levels[2], highest: this.#levels[3]};
    /**
     * Возвращает ID уровня по названию.
     * @param {string} fndName строка с названием уровня
     * @returns {number} ID уровня
     */
    static getIDByName(fndName) {
        let res = this.#levels.findIndex((val) => {return val === fndName});
        if (res == -1) {
            throw 'PreferenceLevel.getIDByName() error. Unknown name.';
        }
        return res;
    }
    /**
     * Возвращает название уровня предпочтений по ID.
     * @param {number} fndID ID уровня
     * @returns {string} название искомого уровня
     */
    static getNameByID(fndID) {
        let res = this.#levels[fndID];
        if (res === undefined) {
            throw 'PreferenceLevel.getNameByID() error. Unknown ID.';
        }
        return res;
    }
    /**
     * Возвращает массив строк, содержащий все названия типов игры.
     * @returns {[string]} массив строк, со всеми типами
     */
    static getAllLevelsArr() {
        return Array.from(this.#levels);
    }
    /**
     * getter для доступа к сокращениям уровней.
     * Возвращает объект с полями lowest, belowaverage, average, highest.
     */
    static get Levels() {
        return this.#Levels;
    }
}

function prefLvlWithin3(val) {
    let res = val;
    if (res > 3) {
        res = 3;
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
        this._Level = prefLvlWithin3(setLevel);
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
    /**
     * Возвращает название установленного в сущности уровня предпочтения.
     * @returns {string} название уровня предпочтения
     */
    get LevelName() {
        return PreferenceLevel.getNameByID(this._Level);
    }
    /**
     * Задаёт уровень предпочтения по текстовому названию из класса PreferenceLevels.
     * @param {string} lvlName
     */
    set LevelName(lvlName) {
        this._Level = PreferenceLevel.getIDByName(lvlName);
    }
    get Level() {
        return this._Level;
    }
    set Level(level) {
        this._Level = prefLvlWithin3(level);
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

//#region Database
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

//#endregion