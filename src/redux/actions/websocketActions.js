export const SET_MESSAGE_SENT = 'SET_MESSAGE_SENT';
export const SET_MESSAGE_RECEIVED = 'SET_MESSAGE_RECEIVED';

export function setMessageSent(body) {
    return {
        type: SET_MESSAGE_SENT,
        body
    };
}

export function setMessageReceived(body) {
    return {
        type: SET_MESSAGE_RECEIVED,
        body
    };
}
