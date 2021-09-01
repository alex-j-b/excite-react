import {
    SET_MESSAGE_SENT,
    SET_MESSAGE_RECEIVED
} from '../actions/websocketActions';

import { betStatus, pendingStatus } from '../../libs/infos';
import { timestampToDate } from '../../libs/timestampToDate';


const websocketReducer = (state, action) => {
    let newState = JSON.parse(JSON.stringify(state));
    
    switch (action.type) {

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

        default:
            return state;
    }
};

export default websocketReducer;
