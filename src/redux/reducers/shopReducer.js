import {
    GET_SHOP_ARTICLES,
    ADD_CART,
    DELETE_CART,
    GET_CART,
    ADD_COMMAND,
    GET_COMMAND,
    BUY_ECOIN
} from '../actions/shopActions';

import { timestampToDate } from '../../libs/timestampToDate';


const shopReducer = (state, action) => {
    let newState = JSON.parse(JSON.stringify(state));
    
    switch (action.type) {

        //////////////////////////////////////////////////////////////////// SHOP /////////////////////////////////////////////////////////////////

        case GET_SHOP_ARTICLES:
            const shopArticles = action.body.sort((a, b) => (a.price > b.price) ? 1 : -1);
            return {
                ...newState,
                shopArticles: shopArticles
            };


        case ADD_CART:
            const addCartArticle = action.body;
            const addCartIndex = newState.cartArticles.findIndex(el => {
                return el.articleId === addCartArticle.articleId;
            });

            if (addCartIndex > -1) {
                newState.cartArticles[addCartIndex] = addCartArticle;
            }
            else {
                newState.cartArticles.push(addCartArticle);
            }

            return {
                ...newState,
                cartArticles: newState.cartArticles
            };


        case DELETE_CART:
            const deleteCartArticle = action.body;
            const deleteCartIndex = newState.cartArticles.findIndex(el => {
                return el.articleId === deleteCartArticle.articleId;
            });

            if (deleteCartIndex > -1) {
                newState.cartArticles.splice(deleteCartIndex, 1);
            }

            return {
                ...newState,
                cartArticles: newState.cartArticles
            };


        case GET_CART:
            return {
                ...newState,
                cartArticles: action.body
            };


        case ADD_COMMAND:
            let addCommandArticles = action.body;
            addCommandArticles.date = timestampToDate(Number(addCommandArticles.timestamp));
            newState.commandArticles.unshift(addCommandArticles);

            newState.user['custom:ecoin'] = Number(newState.user['custom:ecoin']) - addCommandArticles.totalPrice;

            return {
                ...newState,
                user: newState.user,
                cartArticles: [],
                commandArticles: newState.commandArticles
            };


        case GET_COMMAND:
            let getCommandArticles = action.body;
            getCommandArticles.forEach(elArticle => {
                elArticle.date = timestampToDate(Number(elArticle.timestamp));
            });

            return {
                ...newState,
                commandArticles: getCommandArticles
            };


        case BUY_ECOIN:
            newState.user['custom:ecoin'] = Number(newState.user['custom:ecoin']) + Number(action.ecoinAmount);

            return {
                ...newState,
                user: newState.user
            };

        default:
            return state;
    }
};

export default shopReducer;
