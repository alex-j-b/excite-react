import {
    SET_USER,
    CHECK_LOL_ACCOUNT
} from './actions';

const DEFAULT_STATE = {
    isLogged: false,
    authStatus: '',
    user: {},
    forceUpdate: 0
}

export default function refresh(state = DEFAULT_STATE, action = {}) {
    let newState = {...state};
    let newStateUser = Object.assign({}, newState.user);
    switch(action.type) {

        case SET_USER:
            let user = action.user;
            let isLogged, authStatus;
            
            if (typeof user === "string") {
                console.log('string: ', user)
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

        case CHECK_LOL_ACCOUNT:
            const body = action.body;
            console.log('body: ', body)
            newStateUser['custom:games_account'].lol = { region: body.region, accountId: body.accountId };

            return {
                ...newState,
                user: newStateUser
            };

        default:
            return state;
    }
}