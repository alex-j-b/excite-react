import { Auth, API } from "aws-amplify";
import AWS from 'aws-sdk/global';

export const SET_USER = 'SET_USER';
export const GET_BETS = 'GET_BETS';
export const ADD_BET = 'ADD_BET';
export const CONFIRM_LOL_ACCOUNT = 'CONFIRM_LOL_ACCOUNT';
export const CONFIRM_FORTNITE_ACCOUNT = 'CONFIRM_FORTNITE_ACCOUNT';
export const CONFIRM_CSGO_ACCOUNT = 'CONFIRM_CSGO_ACCOUNT';


const rmvEmptyValues = (obj) => {
    Object.keys(obj).forEach((key) => (obj[key]==='') && delete obj[key]);
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
            console.log(currentAuthenticatedUser)
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
////////////////////////////////////////////////////////////// GAMES //////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
            if (response.statusCode === 200) {
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
            if (response.statusCode === 200) {
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
export function addLolBet(ecoinBet) {
    return dispatch => {
        API.post('exciteAPI', '/lol/addBet', {
            'body': {
                'ecoinBet': ecoinBet
            }
        }).then(response => {
            if (response.statusCode === 200) {
                dispatch(setAddLolBet(response.body));
            }
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
            if (response.statusCode === 200) {
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
            if (response.statusCode === 200) {
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
export function addFortniteBet(ecoinBet) {
    return dispatch => {
        API.post('exciteAPI', '/fortnite/addBet', {
            'body': {
                'ecoinBet': ecoinBet
            }
        }).then(response => {
            if (response.statusCode === 200) {
                dispatch(setAddFortniteBet(response.body));
            }
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
            if (response.statusCode === 200) {
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
            if (response.statusCode === 200) {
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
export function addCsgoBet(ecoinBet) {
    return dispatch => {
        API.post('exciteAPI', '/csgo/addBet', {
            'body': {
                'ecoinBet': ecoinBet
            }
        }).then(response => {
            if (response.statusCode === 200) {
                dispatch(setAddCsgoBet(response.body));
            }
        });
    }
}