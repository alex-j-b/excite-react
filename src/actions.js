import { Auth, API } from "aws-amplify";
import AWS from 'aws-sdk/global';

export const SET_USER = 'SET_USER';

export const CONFIRM_LOL_ACCOUNT = 'CONFIRM_LOL_ACCOUNT';
export const CONFIRM_FORTNITE_ACCOUNT = 'CONFIRM_FORTNITE_ACCOUNT';
export const CONFIRM_CSGO_ACCOUNT = 'CONFIRM_CSGO_ACCOUNT';
export const CONFIRM_FIFA20_ACCOUNT = 'CONFIRM_FIFA20_ACCOUNT';
export const GET_BETS = 'GET_BETS';
export const ADD_BET = 'ADD_BET';
export const UPDATE_BET_LOST = 'UPDATE_BET_LOST';
export const ADD_SCREENSHOT = 'ADD_SCREENSHOT';

export const GET_SHOP_ARTICLES = 'GET_SHOP_ARTICLES';
export const ADD_CART = 'ADD_CART';
export const DELETE_CART = 'DELETE_CART';
export const GET_CART = 'GET_CART';
export const ADD_COMMAND = 'ADD_COMMAND';
export const GET_COMMAND = 'GET_COMMAND';
export const BUY_ECOIN = 'BUY_ECOIN';

export const SET_MESSAGE_SENT = 'SET_MESSAGE_SENT';
export const SET_MESSAGE_RECEIVED = 'SET_MESSAGE_RECEIVED';


const rmvEmptyValues = (obj) => {
    Object.keys(obj).forEach((key) => (obj[key] === '') && delete obj[key]);
    return obj;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////// USER COGNITO ///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function setUser(user) {
    return {
        type: SET_USER,
        user
    };
}

export function loggedInCheck() {
    return async dispatch => {
        try {
            const currentAuthenticatedUser = await Auth.currentAuthenticatedUser();
            const attributes = await Auth.userAttributes(currentAuthenticatedUser);
            let user = {};
            attributes.forEach(el => {
                user[el.Name] = el.Value;
            });
            user['custom:ecoin'] = user['custom:ecoin'] ? user['custom:ecoin'] : '500';

            const getGameAccounts = await API.get('exciteAPI', '/getGameAccounts');
            let gameAccounts = {};
            getGameAccounts.body.forEach(el => {
                gameAccounts[el.game] = el;
                delete gameAccounts[el.game].game;
            });
            user['game_accounts'] = gameAccounts;

            if (user.email_verified === 'true') {
                dispatch(setUser(user));
            }
            else {
                const userSession = await Auth.currentSession();
                await Auth.signOut();
                const params = { AccessToken: userSession.accessToken.jwtToken };
                let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({region: 'eu-west-2'});
                cognitoidentityserviceprovider.deleteUser(params, function(error, data) {
                    error ? console.log(error) : dispatch(setUser("deleteUser"));
                });
            }
        } catch(e) {
            console.log(e);
            dispatch(setUser("logOut"));
        }
    }
}

export function logIn(userCredentials) {
    return async dispatch => {
        try {
            const userSignIn = await Auth.signIn(userCredentials.email, userCredentials.password);
            let user = userSignIn.attributes;
            user['custom:ecoin'] = user['custom:ecoin'] ? user['custom:ecoin'] : '500';

            const getGameAccounts = await API.get('exciteAPI', '/getGameAccounts');
            let gameAccounts = {};
            getGameAccounts.body.forEach(el => {
                gameAccounts[el.game] = el;
                delete gameAccounts[el.game].game;
            });
            user['game_accounts'] = gameAccounts;

            dispatch(setUser(user));
        } catch(e) {
            console.log(e);
            dispatch(setUser("errorPassword"));
        }
    }
}

export function logOut() {
    return async dispatch => {
        try {
            await Auth.signOut();
            dispatch(setUser("logOut"));
        } catch(e) {
            console.log(e);
        }
    }
}

export function updateUser(newAttributes) {
    return async dispatch => {
        try {
            const currentAuthenticatedUser = await Auth.currentAuthenticatedUser();
            await Auth.updateUserAttributes(currentAuthenticatedUser, rmvEmptyValues(newAttributes));

            const attributes = await Auth.userAttributes(currentAuthenticatedUser);
            let user = {};
            attributes.forEach(el => {
                user[el.Name] = el.Value;
            });
            user['custom:ecoin'] = user['custom:ecoin'] ? user['custom:ecoin'] : '500';

            const getGameAccounts = await API.get('exciteAPI', '/getGameAccounts');
            let gameAccounts = {};
            getGameAccounts.body.forEach(el => {
                gameAccounts[el.game] = el;
                delete gameAccounts[el.game].game;
            });
            user['game_accounts'] = gameAccounts;

            dispatch(setUser(user));
        } catch(e) {
            console.log(e);
            dispatch(setUser("updateUserFailed"));
        }
    }
}

export function updatePassword(oldPassword, newPassword) {
    return async dispatch => {
        try {
            const currentAuthenticatedUser = await Auth.currentAuthenticatedUser();
            await Auth.changePassword(currentAuthenticatedUser, oldPassword, newPassword);
            dispatch(setUser("confirmationPassword"));
        } catch(e) {
            console.log(e);
            dispatch(setUser("errorPassword"));
        }
    }
}

export function deleteUser() {
    return async dispatch => {
        const userSession = await Auth.currentSession();
        await Auth.signOut();
        const params = { AccessToken: userSession.accessToken.jwtToken };
        let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({region: 'eu-west-2'});
        cognitoidentityserviceprovider.deleteUser(params, function(error, data) {
            error ? console.log(error) : dispatch(setUser("deleteUser"));
        });
    }
}

export function disableUser() {
    return async dispatch => {
        try {
            const currentAuthenticatedUser = await Auth.currentAuthenticatedUser();
            await Auth.updateUserAttributes(currentAuthenticatedUser, {"custom:disabled_account": "true"});
            await Auth.signOut();
            dispatch(setUser("logOut"));
        } catch(e) {
            console.log(e);
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////// WEBSOCKET //////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////// GAMES //////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////// SHOP ///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* ----------------- getArticleShop ----------------- */
export function setGetShopArticles(body) {
    return {
        type: GET_SHOP_ARTICLES,
        body
    };
}
export function getShopArticles() {
    return dispatch => {
        return API.get('exciteAPI', '/shop/getArticles')
        .then(response => {
            if (Number(response.statusCode) === 200) {
                dispatch(setGetShopArticles(response.body));
            }
            return response;
        });
    }
}

/* ----------------- addCart ----------------- */
export function setAddCart(body) {
    return {
        type: ADD_CART,
        body: body
    };
}
export function addCart(articleId, options, quantity, changeQuantity) {
    return dispatch => {
        return API.post('exciteAPI', '/shop/addCart', {
            'body': {
                'articleId': articleId,
                'options': options,
                'quantity': quantity,
                'changeQuantity': changeQuantity
            }
        }).then(response => {
            console.log(response)
            if (Number(response.statusCode) === 200) {
                dispatch(setAddCart(response.body));
            }
            return response;
        });
    }
}

/* ----------------- deleteCart ----------------- */
export function setDeleteCart(body) {
    return {
        type: DELETE_CART,
        body: body
    };
}
export function deleteCart(articleId) {
    return dispatch => {
        API.del('exciteAPI', '/shop/deleteCart', {
            'body': {
                'articleId': articleId
            }
        }).then(response => {
            console.log(response)
            if (Number(response.statusCode) === 200) {
                response.body.articleId = articleId;
                dispatch(setDeleteCart(response.body));
            }
        });
    }
}

/* -------------------- getCart --------------------- */
export function setGetCart(body) {
    return {
        type: GET_CART,
        body: body
    };
}
export function getCart() {
    return dispatch => {
        return API.get('exciteAPI', '/shop/getCart')
        .then(response => {
            console.log(response)
            if (Number(response.statusCode) === 200) {
                dispatch(setGetCart(response.body));
            }
            return response;
        });
    }
}


/* -------------------- addCommand --------------------- */
export function setAddCommand(body) {
    return {
        type: ADD_COMMAND,
        body: body
    };
}
export function addCommand(articles, givenName,familyName, address1, address2, postalCode, city, country, phoneNumber, promoCode) {
    return dispatch => {
        return API.post('exciteAPI', '/shop/addCommand', {
            'body': {
                'articles': articles,
                'givenName': givenName,
                'familyName': familyName,
                'address1': address1,
                'address2': address2,
                'postalCode': postalCode,
                'city': city,
                'country': country,
                'phoneNumber': phoneNumber,
                'promoCode': promoCode
            }
        }).then(response => {
            console.log(response)
            if (Number(response.statusCode) === 200) {
                dispatch(setAddCommand(response.body));
            }
            return response;
        });
    }
}

/* -------------------- getCommand --------------------- */
export function setGetCommand(body) {
    return {
        type: GET_COMMAND,
        body: body
    };
}
export function getCommand() {
    return dispatch => {
        return API.get('exciteAPI', '/shop/getCommand')
        .then(response => {
            console.log(response)
            if (Number(response.statusCode) === 200) {
                dispatch(setGetCommand(response.body));
            }
            return response;
        });
    }
}

/* -------------------- buyEcoin --------------------- */
export function setBuyEcoin(ecoinAmount) {
    return {
        type: BUY_ECOIN,
        ecoinAmount
    };
}
export function buyEcoin(method, ecoinAmount, source) {
    return dispatch => {
        return API.post('exciteAPI', '/buyEcoin', {
            'body': {
                'method': method,
                'ecoin': ecoinAmount,
                'source': source
            }
        }).then(response => {
            console.log(response)
            if (Number(response.statusCode) === 200) {
                dispatch(setBuyEcoin(ecoinAmount));
            }
            return response;
        });
    }
}