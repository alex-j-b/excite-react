import {
    SET_USER,
    CONFIRM_LOL_ACCOUNT,
    CONFIRM_FORTNITE_ACCOUNT,
    CONFIRM_CSGO_ACCOUNT,
    CONFIRM_FIFA20_ACCOUNT,
    GET_BETS,
    ADD_BET,
    UPDATE_BET_LOST,
    ADD_SCREENSHOT,
    GET_SHOP_ARTICLES,
    ADD_CART,
    DELETE_CART,
    GET_CART,
    ADD_COMMAND,
    GET_COMMAND,
    BUY_ECOIN,
    SET_MESSAGE_SENT,
    SET_MESSAGE_RECEIVED
} from './actions';
import { betStatus } from './libs/infos';

const DEFAULT_STATE = {
    isLogged: false,
    isLogging: true,
    authStatus: '',
    user: {},
    forceUpdate: 0,
    betsHistory: [],
    pendingBets: {},
    shopArticles: [],
    cartArticles: [],
    commandArticles: []
}

export default function refresh(state = DEFAULT_STATE, action = {}) {
    let newState = JSON.parse(JSON.stringify(state));
    const pendingStatus = ['pending', 'playing', 'creating', 'confirmLost'];

    const timestampToDate = (timestamp) => {
        let date = new Date(timestamp);
        let day = date.getDate() > 9 ? date.getDate() : '0' + (date.getDate()).toString();
        let month = date.getMonth()+1 > 9 ? date.getMonth()+1 : '0' + (date.getMonth()+1).toString();
        let min = date.getMinutes() > 9 ? date.getMinutes() : '0' + (date.getMinutes()).toString();
        let year = date.getFullYear().toString().substr(2);

        return `${day}/${month}/${year} à ${date.getHours()}h${min}`;
    }

    switch(action.type) {

        ////////////////////////////////////////////////////////////// USER COGNITO ///////////////////////////////////////////////////////////
        case SET_USER:
            let user = action.user;
            let isLogged, authStatus;
            
            if (typeof user === "string") {
                console.log('userNotif: ', user)
                authStatus = action.user;
                if (user === "logOut" || user === "deleteUser") {
                    isLogged = false;
                    user = {};
                    newState.betsHistory = [];
                    newState.pendingBets = {};
                    newState.cartArticles = [];
                    newState.commandArticle = [];
                }
                else {
                    console.log('newState.user: ', newState.user)
                    isLogged = newState.isLogged;
                    user = newState.user;
                }
            }
            else {
                isLogged = true;
                authStatus = '';
                const bdArray = user.birthdate.split("-");
                user.bdYear = bdArray[0];
                user.bdMonth = bdArray[1];
                user.bdDay = bdArray[2];
                console.log('user: ', user)
            }

            return {
                ...newState,
                forceUpdate: newState.forceUpdate + 1,
                isLogged: isLogged,
                isLogging: false,
                authStatus: authStatus,
                user: user,
                betsHistory: newState.betsHistory,
                pendingBets: newState.pendingBets,
                cartArticles: newState.cartArticles,
                commandArticles: newState.commandArticles
            };

        //////////////////////////////////////////////////////////////////// WEBSOCKET /////////////////////////////////////////////////////////////

        case SET_MESSAGE_SENT:
            const messageSent = action.body;
            console.log('messageSent: ', messageSent)

            return {
                ...newState
            };

        case SET_MESSAGE_RECEIVED:
            const messageReceived = action.body;
            console.log('messageReceived: ', messageReceived)

            if (messageReceived.action.includes('PendingBet')) {
                let newPendingBet = JSON.parse(JSON.stringify(messageReceived));
                for (let [key, value] of Object.entries(newPendingBet)) {
                    if (typeof value === 'object') {
                        newPendingBet[key] = value[Object.keys(value)[0]];
                    }
                }
                newPendingBet.message = betStatus[newPendingBet.status] || 'En cours... ';
                newPendingBet.date = timestampToDate(Number(newPendingBet.timestamp));

                if (messageReceived.action === 'updatePendingBet') {
                    console.log('updatePendingBet')
                    const betIndex = newState.betsHistory.findIndex(el => el.betId === newPendingBet.betId);
                    console.log(betIndex)
                    if (betIndex > -1) {
                        newState.betsHistory[betIndex] = newPendingBet;
                        if (pendingStatus.includes(newPendingBet.status)) {
                            console.log('pendingStatus.includes(newPendingBet.status)')
                            newState.pendingBets[newPendingBet.game] = newPendingBet;
                        }
                        else {
                            console.log('else {')
                            if (newPendingBet.game in newState.pendingBets) {
                                delete newState.pendingBets[newPendingBet.game];
                            }
                            else {
                                let ecoinToAdd = Number(newPendingBet.ecoin) * Number(newPendingBet.odds);
                                newState.user['custom:ecoin'] = Number(newState.user['custom:ecoin']) + ecoinToAdd;
                            }
                        }
                    }
                }
                else if (messageReceived.action === 'addPendingBet') {
                    console.log('addPendingBet')
                    newPendingBet.game = newPendingBet.game ? newPendingBet.game : newPendingBet.type.split('-')[0];
                    newState.user['custom:ecoin'] = Number(newState.user['custom:ecoin']) - Number(newPendingBet.ecoin);
                    newState.betsHistory.unshift(newPendingBet);
                    newState.pendingBets[newPendingBet.game] = newPendingBet;
                }
            }

            return {
                ...newState,
                user: newState.user,
                betsHistory: newState.betsHistory,
                pendingBets: newState.pendingBets
            };

        ////////////////////////////////////////////////////////////// CONFIRM ACCOUNTS ///////////////////////////////////////////////////////////

        case CONFIRM_LOL_ACCOUNT:
            const lolAccount = action.body;
            newState.user['game_accounts'].leagueoflegends = lolAccount;
            delete newState.user['game_accounts'].leagueoflegends.game;

            return {
                ...newState,
                user: newState.user
            };

        case CONFIRM_FORTNITE_ACCOUNT:
            const fortniteAccount = action.body;
            newState.user['game_accounts'].fortnite = fortniteAccount;
            delete newState.user['game_accounts'].fortnite.game;

            return {
                ...newState,
                user: newState.user
            };


        case CONFIRM_CSGO_ACCOUNT:
            const csgoAccount = action.body;
            newState.user['game_accounts'].counterstrikego = csgoAccount;
            delete newState.user['game_accounts'].counterstrikego.game;

            return {
                ...newState,
                user: newState.user
            };


        case CONFIRM_FIFA20_ACCOUNT:
            const fifa20Account = action.body;
            newState.user['game_accounts'].fifa20 = fifa20Account;
            delete newState.user['game_accounts'].fifa20.game;

            return {
                ...newState,
                user: newState.user
            };

        //////////////////////////////////////////////////////////////////// BETS /////////////////////////////////////////////////////////////////

        case GET_BETS:
            console.log('GET_BETS: ', action.actions.game)
            const getBets = action.actions.body;
            let betPending = false;
            let allTimestamps = newState.betsHistory.map(bet => bet.timestamp);

            getBets.forEach(el => {
                el.game = action.actions.game;
                el.message = betStatus[el.status] || 'En cours... ';
                el.date = timestampToDate(Number(el.timestamp));

                if (allTimestamps.includes(el.timestamp)) {
                    const oldIndex = newState.betsHistory.findIndex(bet => Number(bet.timestamp) === Number(el.timestamp));
                    newState.betsHistory[oldIndex] = el;
                }
                else {
                    allTimestamps.push(el.timestamp);
                    newState.betsHistory.push(el);
                }

                if (pendingStatus.includes(el.status) && (!el.screenshot || el.screenshot === 'null')) {
                    newState.pendingBets[action.actions.game] = el;
                    betPending = true;
                }
            });
            newState.betsHistory.sort((a, b) => {
                return b.timestamp - a.timestamp;
            });

            if (!betPending) delete newState.pendingBets[action.actions.game];

            console.log('betsHistory: ', newState.betsHistory)
            console.log('pendingBets: ', newState.pendingBets)

            return {
                ...newState,
                betsHistory: newState.betsHistory,
                pendingBets: newState.pendingBets
            };


        case ADD_BET:
            console.log('ADD_BET')
            let newBet = action.actions.body;

            newBet.game = action.actions.game;
            newBet.message = betStatus[newBet.status] || 'En cours... ';
            newBet.date = timestampToDate(Number(newBet.timestamp));

            newState.betsHistory.unshift(newBet);
            newState.pendingBets[action.actions.game] = newBet;

            newState.user['custom:ecoin'] = Number(newState.user['custom:ecoin']) - newBet.ecoin;

            console.log('betsHistory: ', newState.betsHistory)
            console.log('pendingBets: ', newState.pendingBets)

            return {
                ...newState,
                user: newState.user,
                betsHistory: newState.betsHistory,
                pendingBets: newState.pendingBets
            };


        case UPDATE_BET_LOST:
            console.log('UPDATE_BET_LOST')
            const betUpdated = action.actions.body;

            const oldIndex = newState.betsHistory.findIndex(bet => bet.betId === betUpdated.betId);
            newState.betsHistory[oldIndex].status = 'lost';
            newState.betsHistory[oldIndex].message = 'Défaite -';
            delete newState.pendingBets[action.actions.game];

            return {
                ...newState,
                betsHistory: newState.betsHistory,
                pendingBets: newState.pendingBets
            };

        case ADD_SCREENSHOT:
            console.log('ADD_SCREENSHOT')
            const screenshotBet = action.body;
            const betIndex = newState.betsHistory.findIndex(el => el.betId === screenshotBet.betId);
            console.log(betIndex)
            if (betIndex > -1) newState.betsHistory[betIndex].screenshot = screenshotBet.name;
            delete newState.pendingBets[screenshotBet.game];

            return {
                ...newState,
                user: newState.user,
                betsHistory: newState.betsHistory,
                pendingBets: newState.pendingBets
            };


        //////////////////////////////////////////////////////////////////// SHOP /////////////////////////////////////////////////////////////////

        case GET_SHOP_ARTICLES:
            const shopArticles = action.body.sort((a, b) => (a.price > b.price) ? 1 : -1);
            return {
                ...newState,
                shopArticles: shopArticles
            };


        case ADD_CART:
            const addCartArticle = action.body;
            const addCartIndex = newState.cartArticles.findIndex(el => {
                return el.articleId === addCartArticle.articleId;
            });

            if (addCartIndex > -1) {
                newState.cartArticles[addCartIndex] = addCartArticle;
            }
            else {
                newState.cartArticles.push(addCartArticle);
            }

            return {
                ...newState,
                cartArticles: newState.cartArticles
            };


        case DELETE_CART:
            const deleteCartArticle = action.body;
            const deleteCartIndex = newState.cartArticles.findIndex(el => {
                return el.articleId === deleteCartArticle.articleId;
            });

            if (deleteCartIndex > -1) {
                newState.cartArticles.splice(deleteCartIndex, 1);
            }

            return {
                ...newState,
                cartArticles: newState.cartArticles
            };


        case GET_CART:
            return {
                ...newState,
                cartArticles: action.body
            };


        case ADD_COMMAND:
            let addCommandArticles = action.body;
            addCommandArticles.date = timestampToDate(Number(addCommandArticles.timestamp));
            newState.commandArticles.unshift(addCommandArticles);

            newState.user['custom:ecoin'] = Number(newState.user['custom:ecoin']) - addCommandArticles.totalPrice;

            return {
                ...newState,
                user: newState.user,
                cartArticles: [],
                commandArticles: newState.commandArticles
            };


        case GET_COMMAND:
            let getCommandArticles = action.body;
            getCommandArticles.forEach(elArticle => {
                elArticle.date = timestampToDate(Number(elArticle.timestamp));
            });

            return {
                ...newState,
                commandArticles: getCommandArticles
            };


        case BUY_ECOIN:
            newState.user['custom:ecoin'] = Number(newState.user['custom:ecoin']) + Number(action.ecoinAmount);

            return {
                ...newState,
                user: newState.user
            };


        default:
            return state;
    }
}