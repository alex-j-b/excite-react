import {
    SET_USER,
} from '../actions/authActions';


const authReducer = (state, action) => {
    let newState = JSON.parse(JSON.stringify(state));

    switch (action.type) {

        ////////////////////////////////////////////////////////////// USER COGNITO ///////////////////////////////////////////////////////////
        case SET_USER:
            let user = action.user;
            let isLogged, authStatus;

            if (typeof user === "string") {
                console.log('userNotif: ', user)
                authStatus = action.user;
                if (user === "logOut" || user === "deleteUser") {
                    isLogged = false;
                    user = {};
                    newState.betsHistory = [];
                    newState.pendingBets = {};
                    newState.cartArticles = [];
                    newState.commandArticle = [];
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
                isLogging: false,
                authStatus: authStatus,
                user: user,
                betsHistory: newState.betsHistory,
                pendingBets: newState.pendingBets,
                cartArticles: newState.cartArticles,
                commandArticles: newState.commandArticles
            };

        default:
            return state;
    }
};

export default authReducer;
