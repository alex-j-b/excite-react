import { API } from "aws-amplify";

export const CONFIRM_LOL_ACCOUNT = 'CONFIRM_LOL_ACCOUNT';
export const CONFIRM_FORTNITE_ACCOUNT = 'CONFIRM_FORTNITE_ACCOUNT';
export const CONFIRM_CSGO_ACCOUNT = 'CONFIRM_CSGO_ACCOUNT';
export const CONFIRM_FIFA20_ACCOUNT = 'CONFIRM_FIFA20_ACCOUNT';
export const GET_BETS = 'GET_BETS';
export const ADD_BET = 'ADD_BET';
export const UPDATE_BET_LOST = 'UPDATE_BET_LOST';
export const ADD_SCREENSHOT = 'ADD_SCREENSHOT';


/* ----------------- CheckQueue ----------------- */
export function checkQueue() {
    return API.get('exciteAPI', '/checkQueue')
    .then(response => {
        return response;
    });
}

// ----------------//---------------- League of Legends ----------------//---------------- //

/* ----------------- ConfirmLolAccount ----------------- */
export function setConfirmLolAccount(body) {
    return {
        type: CONFIRM_LOL_ACCOUNT,
        body: body
    };
}
export function confirmLolAccount(summonerName, region) {
    return dispatch => {
        return API.get('exciteAPI', '/lol/confirmAccount', {
            'queryStringParameters': {
                'summonerName': encodeURIComponent(summonerName),
                'region': region
            }
        }).then(response => {
            console.log(response)
            if (Number(response.statusCode) === 200) {
                dispatch(setConfirmLolAccount(response.body));
            }
            return response;
        });
    }
}

/* -------------------- getLolBets --------------------- */
export function setGetLolBets(body) {
    return {
        type: GET_BETS,
        actions: {
            body: body,
            game: 'leagueoflegends'
        }
    };
}
export function getLolBets() {
    return dispatch => {
        API.get('exciteAPI', '/lol/getBets')
        .then(response => {
            if (Number(response.statusCode) === 200) {
                dispatch(setGetLolBets(response.body));
            }
        });
    }
}

/* --------------------- addLolBet --------------------- */
export function setAddLolBet(body) {
    return {
        type: ADD_BET,
        actions: {
            body: body,
            game: 'leagueoflegends'
        }
    };
}
export function addLolBet(type, ecoin) {
    return dispatch => {
        return API.post('exciteAPI', '/lol/addBet', {
            'body': {
                'type': type,
                'ecoin': ecoin
            }
        }).then(response => {
            if (Number(response.statusCode) === 200) {
                dispatch(setAddLolBet(response.body));
            }
            return response;
        });
    }
}


// -------------------//----------------- Fortnite -------------------//------------------ //

/* ------------- ConfirmFortniteAccount --------------- */
export function setConfirmFortniteAccount(body) {
    return {
        type: CONFIRM_FORTNITE_ACCOUNT,
        body
    };
}
export function confirmFortniteAccount(accountId) {
    return dispatch => {
        return API.get('exciteAPI', '/fortnite/confirmAccount', {
            'queryStringParameters': {
                'accountId': encodeURIComponent(accountId)
            }
        }).then(response => {
            console.log(response)
            if (Number(response.statusCode) === 200) {
                dispatch(setConfirmFortniteAccount(response.body));
            }
            return response;
        });
    }
}

/* ------------------ getFortniteBets ------------------ */
export function setGetFortniteBets(body) {
    return {
        type: GET_BETS,
        actions: {
            body: body,
            game: 'fortnite'
        }
    };
}
export function getFortniteBets() {
    return dispatch => {
        API.get('exciteAPI', '/fortnite/getBets')
        .then(response => {
            if (Number(response.statusCode) === 200) {
                dispatch(setGetFortniteBets(response.body));
            }
        });
    }
}

/* ------------------- addFortniteBet ------------------- */
export function setAddFortniteBet(body) {
    return {
        type: ADD_BET,
        actions: {
            body: body,
            game: 'fortnite'
        }
    };
}
export function addFortniteBet(type, ecoin) {
    return dispatch => {
        return API.post('exciteAPI', '/fortnite/addBet', {
            'body': {
                'type': type,
                'ecoin': ecoin
            }
        }).then(response => {
            if (Number(response.statusCode) === 200) {
                dispatch(setAddFortniteBet(response.body));
            }
            return response;
        });
    }
}


// ----------------//---------------- Counter Strike -------------------//------------- //

/* ----------------- ConfirmCsgoAccount ------------------- */
export function setConfirmCsgoAccount(body) {
    return {
        type: CONFIRM_CSGO_ACCOUNT,
        body: body
    };
}
export function confirmCsgoAccount(steamId64, authenticationCode, lastMatchToken) {
    return dispatch => {
        return API.get('exciteAPI', '/csgo/confirmAccount', {
            'queryStringParameters': {
                'steamId64': steamId64,
                'authenticationCode': authenticationCode,
                'lastMatchToken': lastMatchToken
            }
        }).then(response => {
            console.log(response)
            if (Number(response.statusCode) === 200) {
                dispatch(setConfirmCsgoAccount(response.body));
            }
            return response;
        });
    }
}

/* ------------------ getCsgoBets ------------------ */
export function setGetCsgoBets(body) {
    return {
        type: GET_BETS,
        actions: {
            body: body,
            game: 'counterstrikego'
        }
    };
}
export function getCsgoBets() {
    return dispatch => {
        API.get('exciteAPI', '/csgo/getBets')
        .then(response => {
            if (Number(response.statusCode) === 200) {
                dispatch(setGetCsgoBets(response.body));
            }
        });
    }
}

/* ------------------- addCsgoBet ------------------- */
export function setAddCsgoBet(body) {
    return {
        type: ADD_BET,
        actions: {
            body: body,
            game: 'counterstrikego'
        }
    };
}
export function addCsgoBet(type, ecoin) {
    return dispatch => {
        return API.post('exciteAPI', '/csgo/addBet', {
            'body': {
                'type': type,
                'ecoin': ecoin
            }
        }).then(response => {
            if (Number(response.statusCode) === 200) {
                dispatch(setAddCsgoBet(response.body));
            }
            return response;
        });
    }
}

/* ------------------- joinCsgoQueue ------------------- */
export function joinCsgoQueue(type, ecoin) {
    return API.post('exciteAPI', '/csgo/joinQueue', {
        'body': {
            'type': type,
            'ecoin': ecoin
        }
    }).then(response => {
        return response;
    });
}


// ----------------//---------------- Fifa 20 -------------------//------------- //

/* ----------------- ConfirmFifa20Account ------------------- */
export function setConfirmFifa20Account(body) {
    return {
        type: CONFIRM_FIFA20_ACCOUNT,
        body: body
    };
}
export function confirmFifa20Account(accountId, plateform) {
    return dispatch => {
        return API.get('exciteAPI', '/fifa20/confirmAccount', {
            'queryStringParameters': {
                'accountId': accountId,
                'plateform': plateform
            }
        }).then(response => {
            console.log(response)
            if (Number(response.statusCode) === 200) {
                dispatch(setConfirmFifa20Account(response.body));
            }
            return response;
        });
    }
}

/* ------------------ getFifa20Bets ------------------ */
export function setGetFifa20Bets(body) {
    return {
        type: GET_BETS,
        actions: {
            body: body,
            game: 'fifa20'
        }
    };
}
export function getFifa20Bets() {
    return dispatch => {
        API.get('exciteAPI', '/fifa20/getBets')
        .then(response => {
            if (Number(response.statusCode) === 200) {
                dispatch(setGetFifa20Bets(response.body));
            }
        });
    }
}

/* ------------------- joinCsgoQueue ------------------- */
export function joinFifa20Queue(type, ecoin) {
    return API.post('exciteAPI', '/fifa20/joinQueue', {
        'body': {
            'type': type,
            'ecoin': ecoin
        }
    }).then(response => {
        return response;
    });
}

// ----------------//---------------- updateBetLost -------------------//------------- //
export function setUpdateBetLost(game, body) {
    return {
        type: UPDATE_BET_LOST,
        actions: {
            game: game,
            body: body
        }
    };
}
export function updateBetLost(game, betId) {
    return dispatch => {
        return API.post('exciteAPI', '/updateBetLost', {
            'body': {
                'game': game,
                'betId': betId
            }
        }).then(response => {
            console.log(response)
            if (Number(response.statusCode) === 200) {
                dispatch(setUpdateBetLost(game, response.body));
            }
            return response;
        });
    }
}

// ----------------//---------------- addScreenshot -------------------//------------- //
export function setAddScreenshot(body) {
    return {
        type: ADD_SCREENSHOT,
        body: body
    };
}
export function addScreenshot(betId, game, file) {
    const body = {
        'betId': betId,
        'game': game,
        'file': file
    };
    return dispatch => {
        return API.post('exciteAPI', '/addScreenshot', {
            'body': body
        }).then(response => {
            console.log(response)
            if (Number(response.statusCode) === 200) {
                dispatch(setAddScreenshot(body));
            }
            return response;
        });
    }
}
