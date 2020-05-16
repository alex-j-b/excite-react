import {
    SET_USER,
    CONFIRM_LOL_ACCOUNT,
    CONFIRM_FORTNITE_ACCOUNT,
    CONFIRM_CSGO_ACCOUNT,
    CONFIRM_FIFA20_ACCOUNT,
    GET_BETS,
    ADD_BET,
    UPDATE_BET_LOST,
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
    let newState = {...state};
    let newStateUser = Object.assign({}, newState.user);
    let newStateBetsHistory = [...newState.betsHistory];
    let newStatePendingBets = Object.assign({}, newState.pendingBets);
    let newStateCart = [...newState.cartArticles];
    const pendingStatus = ['pending', 'playing', 'creating'];

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
                user: user
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
                let newPendingBet = messageReceived;
                for (let [key, value] of Object.entries(messageReceived)) {
                    if (typeof value === 'object') {
                        newPendingBet[key] = value[Object.keys(value)[0]];
                    }
                }
                newPendingBet.message = ({win: 'Victoire +', lost: 'Défaite -'})[newPendingBet.status] || 'En cours... ';
                newPendingBet.date = timestampToDate(Number(newPendingBet.timestamp));

                if (messageReceived.action === 'updatePendingBet') {
                    console.log('updatePendingBet')
                    const betIndex = newStateBetsHistory.findIndex(el => el.betId === messageReceived.betId);
                    console.log(betIndex)
                    if (betIndex > -1) {
                        newStateBetsHistory[betIndex] = newPendingBet;
                        if (pendingStatus.includes(newPendingBet.status)) {
                            console.log('pendingStatus.includes(newPendingBet.status)')
                            newStatePendingBets[messageReceived.game] = newPendingBet;
                        }
                        else {
                            console.log('else {')
                            delete newStatePendingBets[messageReceived.game];
                        }
                    }
                }
                else if (messageReceived.action === 'addPendingBet') {
                    console.log('addPendingBet')
                    newStateUser['custom:ecoin'] = Number(newStateUser['custom:ecoin']) - Number(newPendingBet.ecoin);
                    newStateBetsHistory.unshift(newPendingBet);
                    newStatePendingBets[newPendingBet.game] = newPendingBet;
                }
            }

            return {
                ...newState,
                user: newStateUser,
                betsHistory: newStateBetsHistory,
                pendingBets: newStatePendingBets
            };

        ////////////////////////////////////////////////////////////// CONFIRM ACCOUNTS ///////////////////////////////////////////////////////////

        case CONFIRM_LOL_ACCOUNT:
            const lolAccount = action.body;
            newStateUser['game_accounts'].leagueoflegends = lolAccount;
            delete newStateUser['game_accounts'].leagueoflegends.game;

            return {
                ...newState,
                user: newStateUser
            };

        case CONFIRM_FORTNITE_ACCOUNT:
            const fortniteAccount = action.body;
            newStateUser['game_accounts'].fortnite = fortniteAccount;
            delete newStateUser['game_accounts'].fortnite.game;

            return {
                ...newState,
                user: newStateUser
            };


        case CONFIRM_CSGO_ACCOUNT:
            const csgoAccount = action.body;
            newStateUser['game_accounts'].counterstrikego = csgoAccount;
            delete newStateUser['game_accounts'].counterstrikego.game;

            return {
                ...newState,
                user: newStateUser
            };


        case CONFIRM_FIFA20_ACCOUNT:
            const fifa20Account = action.body;
            newStateUser['game_accounts'].fifa20 = fifa20Account;
            delete newStateUser['game_accounts'].fifa20.game;

            return {
                ...newState,
                user: newStateUser
            };

        //////////////////////////////////////////////////////////////////// BETS /////////////////////////////////////////////////////////////////

        case GET_BETS:
            const getBets = action.actions.body;
            let betPending = false;
            let allTimestamps = newStateBetsHistory.map(bet => bet.timestamp);

            getBets.forEach(el => {
                el.game = action.actions.game;
                el.message = ({win: 'Victoire +', lost: 'Défaite -'})[el.status] || 'En cours... ';
                el.date = timestampToDate(Number(el.timestamp));

                if (allTimestamps.includes(el.timestamp)) {
                    const oldIndex = newStateBetsHistory.findIndex(bet => bet.timestamp === el.timestamp);
                    newStateBetsHistory[oldIndex] = el;
                }
                else {
                    allTimestamps.push(el.timestamp);
                    newStateBetsHistory.push(el);
                }

                if (pendingStatus.includes(el.status)) {
                    newStatePendingBets[action.actions.game] = el;
                    betPending = true;
                }
            });
            newStateBetsHistory.sort((a, b) => {
                return b.timestamp - a.timestamp;
            });

            if (!betPending) delete newStatePendingBets[action.actions.game];

            console.log('betsHistory: ', newStateBetsHistory)
            console.log('pendingBets: ', newStatePendingBets)

            return {
                ...newState,
                betsHistory: newStateBetsHistory,
                pendingBets: newStatePendingBets
            };


        case ADD_BET:
            let newBet = action.actions.body;

            newBet.game = action.actions.game;
            newBet.message = ({win: 'Victoire +', lost: 'Défaite -'})[newBet.status] || 'En cours... ';
            newBet.date = timestampToDate(Number(newBet.timestamp));

            newStateBetsHistory.unshift(newBet);
            newStatePendingBets[action.actions.game] = newBet;

            newStateUser['custom:ecoin'] = Number(newStateUser['custom:ecoin']) - newBet.ecoin;

            console.log('betsHistory: ', newStateBetsHistory)
            console.log('pendingBets: ', newStatePendingBets)

            return {
                ...newState,
                user: newStateUser,
                betsHistory: newStateBetsHistory,
                pendingBets: newStatePendingBets
            };


        case UPDATE_BET_LOST:
            const betUpdated = action.actions.body;

            const oldIndex = newStateBetsHistory.findIndex(bet => bet.betId === betUpdated.betId);
            newStateBetsHistory[oldIndex].status = 'lost';
            newStateBetsHistory[oldIndex].message = 'Défaite -';
            delete newStatePendingBets[action.actions.game];

            return {
                ...newState,
                betsHistory: newStateBetsHistory,
                pendingBets: newStatePendingBets
            };

        //////////////////////////////////////////////////////////////////// SHOP /////////////////////////////////////////////////////////////////

        case GET_SHOP_ARTICLES:
            const shopArticles = [action.body[0], action.body[1], action.body[0], action.body[1], action.body[0], action.body[1], action.body[0], action.body[1], action.body[0], action.body[1], action.body[0], action.body[1]];
            return {
                ...newState,
                shopArticles: shopArticles
            };


        case ADD_CART:
            const addCartArticle = action.body;
            const addCartIndex = newStateCart.findIndex(el => {
                return el.articleId === addCartArticle.articleId;
            });

            if (addCartIndex > -1) {
                newStateCart[addCartIndex] = addCartArticle;
            }
            else {
                newStateCart.push(addCartArticle);
            }

            return {
                ...newState,
                cartArticles: newStateCart
            };


        case DELETE_CART:
            const deleteCartArticle = action.body;
            const deleteCartIndex = newStateCart.findIndex(el => {
                return el.articleId === deleteCartArticle.articleId;
            });

            if (deleteCartIndex > -1) {
                newStateCart.splice(deleteCartIndex, 1);
            }

            return {
                ...newState,
                cartArticles: newStateCart
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

            newStateUser['custom:ecoin'] = Number(newStateUser['custom:ecoin']) - addCommandArticles.totalPrice;

            return {
                ...newState,
                user: newStateUser,
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
            newStateUser['custom:ecoin'] = Number(newStateUser['custom:ecoin']) + Number(action.ecoinAmount);

            return {
                ...newState,
                user: newStateUser
            };


        default:
            return state;
    }
}