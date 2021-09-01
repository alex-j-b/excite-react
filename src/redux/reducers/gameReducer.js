import {
    CONFIRM_LOL_ACCOUNT,
    CONFIRM_FORTNITE_ACCOUNT,
    CONFIRM_CSGO_ACCOUNT,
    CONFIRM_FIFA20_ACCOUNT,
    GET_BETS,
    ADD_BET,
    UPDATE_BET_LOST,
    ADD_SCREENSHOT,
} from '../actions/gameActions';

import { timestampToDate } from '../../libs/timestampToDate';
import { betStatus, pendingStatus } from '../../libs/infos';


const gameReducer = (state, action) => {
    let newState = JSON.parse(JSON.stringify(state));

    switch (action.type) {

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

        default:
            return state;
    }
};

export default gameReducer;
