import { Auth, API } from "aws-amplify";
import AWS from 'aws-sdk/global';

export const SET_USER = 'SET_USER';

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

const rmvEmptyValues = (obj) => {
    Object.keys(obj).forEach((key) => (obj[key] === '') && delete obj[key]);
    return obj;
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
