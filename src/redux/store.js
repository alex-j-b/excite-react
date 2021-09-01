//Redux
import { createStore, applyMiddleware, compose } from 'redux';
import reduceReducers from 'reduce-reducers';
import thunk from 'redux-thunk';
//Reducers
import auth from "./reducers/authReducer";
import websocket from "./reducers/websocketReducer";
import game from "./reducers/gameReducer";
import shop from "./reducers/shopReducer";


const initialState = {
    isLogged: false,
    isLogging: true,
    authStatus: '',
    user: {},
    forceUpdate: 0,
    betsHistory: [],
    pendingBets: {},
    shopArticles: [],
    cartArticles: [],
    commandArticles: []
}

const reducer = reduceReducers(
    initialState,
    auth,
    websocket,
    game,
    shop,
);

export default createStore(reducer, compose(applyMiddleware(thunk)));
