
const dev = {
    cognito: {
        REGION: "eu-west-2",
        USER_POOL_ID: "eu-west-2_EozqvNMMe",
        APP_CLIENT_ID: "7s6giaugde857gs388ksjl7j30",
        IDENTITY_POOL_ID: "eu-west-2:8e8bce6b-10f5-4b61-a5b5-464baa463b26"
    },
    apiGateway: {
        REGION: "eu-west-2",
        URL: "https://api.excite.world/dev"
    },
    stripe: {
        STRIPE_PUBLIC_KEY: "pk_test_Ua3dPWghEeL733J86S3Okzie00nTYcMZJC"
    }
};

const prod = {
    cognito: {
        REGION: "eu-west-2",
        USER_POOL_ID: "eu-west-2_q2DvraEur",
        APP_CLIENT_ID: "2hgm217jl13o4jbvoq5o18hbvm",
        IDENTITY_POOL_ID: "eu-west-2:0d128db5-9640-4d0f-a362-9d23747d8ceb"
    },
    apiGateway: {
        REGION: "eu-west-2",
        URL: "https://api.excite.world/prod"
    },
    stripe: {
        STRIPE_PUBLIC_KEY: "pk_test_Ua3dPWghEeL733J86S3Okzie00nTYcMZJC"
    }
};

const config = process.env.REACT_APP_STAGE === 'prod' ? prod : dev;
export default config;