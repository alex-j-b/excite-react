import {
    SET_USER,
    CONFIRM_LOL_ACCOUNT,
    CONFIRM_FORTNITE_ACCOUNT,
    CONFIRM_CSGO_ACCOUNT,
    GET_BETS,
    ADD_BET
} from './actions';

const DEFAULT_STATE = {
    isLogged: false,
    authStatus: '',
    user: {},
    forceUpdate: 0,
    betsHistory: [],
    pendingBets: {}
}

export default function refresh(state = DEFAULT_STATE, action = {}) {
    let newState = {...state};
    let newStateUser = Object.assign({}, newState.user);
    let newStateBetsHistory = [...newState.betsHistory];
    let newStatePendingBets = Object.assign({}, newState.pendingBets);

    const displayGameFunc = (game) => {
        return ({
            leagueoflegends: 'League of legends',
            fortnite: 'Fortnite',
            counterstrikego: 'Counter Strike'
        })[action.actions.game] || 'undefined';
    } 


    switch(action.type) {

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
                authStatus: authStatus,
                user: user
            };


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


        case GET_BETS:
            const getBets = action.actions.body;
            const displayGame1 = displayGameFunc(action.actions.game);
            let betPending = false;
            let allTimestamps = newStateBetsHistory.map(bet => bet.timestamp);

            getBets.forEach(el => {
                el.game = displayGame1;
                el.message = ({win: 'Victoire +', lost: 'Défaite -'})[el.status] || 'En cours... ';
                let date = new Date(el.timestamp);
                let month = date.getMonth()+1 > 9 ? date.getMonth()+1 : '0' + (date.getMonth()+1).toString();
                let min = date.getMinutes() > 9 ? date.getMinutes() : '0' + (date.getMinutes()).toString();
                el.date = `${date.getFullYear()}/${month}/${date.getDate()} à ${date.getHours()}h${min}`;

                if (allTimestamps.includes(el.timestamp)) {
                    const oldIndex = newStateBetsHistory.findIndex(bet => bet.timestamp === el.timestamp);
                    newStateBetsHistory[oldIndex] = el;
                }
                else {
                    allTimestamps.push(el.timestamp);
                    newStateBetsHistory.push(el);
                }

                if (el.status === 'pending' || el.status === 'playing') {
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
            const displayGame2 = displayGameFunc(action.actions.game);

            newBet.game = displayGame2;
            newBet.message = ({win: 'Victoire +', lost: 'Défaite -'})[newBet.status] || 'En cours... ';
            let date = new Date(newBet.timestamp);
            let month = date.getMonth()+1 > 9 ? date.getMonth()+1 : '0' + (date.getMonth()+1).toString();
            newBet.date = `${date.getFullYear()}/${month}/${date.getDate()} à ${date.getHours()}h${date.getMinutes()}`;

            newStateBetsHistory.unshift(newBet);
            newStatePendingBets[action.actions.game] = newBet;

            console.log('betsHistory: ', newStateBetsHistory)
            console.log('pendingBets: ', newStatePendingBets)

            return {
                ...newState,
                betsHistory: newStateBetsHistory,
                pendingBets: newStatePendingBets
            };

        default:
            return state;
    }
}