import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'raf/polyfill';

//React
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.css';
//Redux
import { Provider } from 'react-redux';
import store from "./redux/store";
//Amplify
import config from "./config";
import Amplify from "aws-amplify";


Amplify.configure({
    Auth: {
        mandatorySignIn: true,
        region: config.cognito.REGION,
        userPoolId: config.cognito.USER_POOL_ID,
        identityPoolId: config.cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID
    },
    API: {
        endpoints: [
            {
                name: "exciteAPI",
                endpoint: config.apiGateway.URL,
                region: config.apiGateway.REGION
            },
        ]
    }
});

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <App/>
        </Provider>
    </BrowserRouter>,
    document.getElementById('root')
);

serviceWorker.register();
