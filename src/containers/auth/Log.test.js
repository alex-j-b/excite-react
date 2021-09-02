//Test
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, shallow, configure } from 'enzyme';
import userEvent from '@testing-library/user-event';
//React
import React from 'react';
import { MemoryRouter } from "react-router-dom";
import App from '../../App';
//Redux
import { Provider } from 'react-redux';
import store from "../../redux/store";
//Amplify
import config from "../../config";
import Amplify from "aws-amplify";

jest.setTimeout(10000);
configure({adapter: new Adapter()});
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


const wrapper = mount(
    <MemoryRouter initialEntries={[ '/connexion' ]}>
        <Provider store={store}>
            <App/>
        </Provider>
    </MemoryRouter>
);

it('Test log', async () => {
    expect(wrapper.find('.auth').hasClass('auth')).toEqual(true);

    const email = wrapper.find('[placeholder="Adresse e-mail"]');
    const password = wrapper.find('[placeholder="Mot de passe"]');
    const button = wrapper.findWhere(node => {
        return node.type() === 'button' && node.text() === "Connexion";
    });
    const form = wrapper.find('form');

    expect(email.exists()).toBe(true);
    expect(password.exists()).toBe(true);
    expect(button.exists()).toBe(true);
    expect(form.exists()).toBe(true);

    email.simulate('change', { target: { name: 'email', value: 'darjeilolol@gmail.com' } });
    password.simulate('change', { target: { name: 'password', value: 'darjeilolol@gmail.com' } });
    form.simulate('submit');

    await (waitFor(() => {
        wrapper.update();
        expect(wrapper.find('.play').hasClass('play')).toEqual(true);
    }, { timeout: 10000 }));
});
