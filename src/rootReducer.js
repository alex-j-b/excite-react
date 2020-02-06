import {
    SET_USER
} from './actions';

const DEFAULT_STATE = {
    isLogged: false,
    authStatus: '',
    user: {},
    forceUpdate: 0
}

export default function refresh(state = DEFAULT_STATE, action = {}) {
    let newState = {...state};
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

        default:
            return state;

    }
}