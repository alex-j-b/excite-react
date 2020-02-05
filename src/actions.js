import { Auth } from "aws-amplify";
import AWS from 'aws-sdk/global';

export const SET_USER = 'SET_USER';

const rmvEmptyValues = (obj) => {
    Object.keys(obj).forEach((key) => (obj[key]==='') && delete obj[key]);
    return obj;
}

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
            dispatch(setUser(user));
        } catch (e) {
            console.log(e);
        }
    }
}

export function sign(userCredentials) {
    return async dispatch => {
        try {
            await Auth.signUp({
                username: userCredentials.email,
                password: userCredentials.password,
                'attributes': {
                    email: userCredentials.email,
                    nickname: userCredentials.email,
                    birthdate: userCredentials.birthdate
                }
            });
            const user = await Auth.signIn(userCredentials.email, userCredentials.password);
            dispatch(setUser(user.attributes));
        } catch (e) {
            console.log(e);
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
        const params = { AccessToken: userSession.accessToken.jwtToken };
        let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({region: 'eu-west-2'});
        cognitoidentityserviceprovider.deleteUser(params, function(error, data) {
            error ? console.log(error) : dispatch(setUser("deleteUser"));
        });
    }
}