import { API } from "aws-amplify";

export const GET_SHOP_ARTICLES = 'GET_SHOP_ARTICLES';
export const ADD_CART = 'ADD_CART';
export const DELETE_CART = 'DELETE_CART';
export const GET_CART = 'GET_CART';
export const ADD_COMMAND = 'ADD_COMMAND';
export const GET_COMMAND = 'GET_COMMAND';
export const BUY_ECOIN = 'BUY_ECOIN';


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