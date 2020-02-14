import { Auth, API } from "aws-amplify";
import AWS from 'aws-sdk/global';

export const SET_USER = 'SET_USER';
export const CHECK_LOL_ACCOUNT = 'CHECK_LOL_ACCOUNT';

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

            if ('custom:games_account' in user) {
                user['custom:games_account'] = JSON.parse(user['custom:games_account']);
            }
            else {
                user['custom:games_account'] = {};
            }

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
        } catch (e) {
            dispatch(setUser("logOut"));
        }
    }
}

export function logIn(userCredentials) {
    return async dispatch => {
        try {
            const user = await Auth.signIn(userCredentials.email, userCredentials.password);
            dispatch(setUser(user.attributes));
        } catch (e) {
            console.log(e);
            dispatch(setUser("errorPassword"))
        }
    }
}

export function logOut() {
    return async dispatch => {
        try {
            await Auth.signOut();
            dispatch(setUser("logOut"))
        } catch (e) {
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
            dispatch(setUser(user));
        } catch (e) {
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
        } catch (e) {
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
        } catch (e) {
            console.log(e);
        }
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////// GAMES //////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ---------------- League of Legends ---------------- //

export function setCheckLolAccount(body) {
    return {
        type: CHECK_LOL_ACCOUNT,
        body
    };
}

export function checkLolAccount(summonerName, region) {
    return async dispatch => {
        const currentAuthenticatedUser = await Auth.currentAuthenticatedUser();
        return API.get('exciteAPI', '/lol/checkAccount', {
            'queryStringParameters': {
            'summonerName': summonerName,
            'region': region,
            'accessToken': currentAuthenticatedUser.signInUserSession.accessToken.jwtToken
            }
        }).then(response => {
            console.log(response.body);
            if (response.statusCode === 200) {
                dispatch(setCheckLolAccount(response.body));
            }
            return response;
        });
    }
}