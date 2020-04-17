
const dev = {
    cognito: {
        REGION: "eu-west-2",
        USER_POOL_ID: "eu-west-2_DGt9kaq7d",
        APP_CLIENT_ID: "2kndbsh83hbb0sl48hu9fkth3",
        IDENTITY_POOL_ID: "eu-west-2:18ba67a2-2c61-4bec-a883-a420b8c9dd8c"
    },
    apiGateway: {
        REGION: "eu-west-2",
        URL: "https://api.excite.world/dev",
        WS_ENDPOINT: "wss://oz1g5a3t82.execute-api.eu-west-2.amazonaws.com/dev"
    },
    stripe: {
        STRIPE_PUBLIC_KEY: "pk_test_Ua3dPWghEeL733J86S3Okzie00nTYcMZJC"
    }
};

const prod = {
    cognito: {
        REGION: "eu-west-2",
        USER_POOL_ID: "eu-west-2_oYWMp5IcS",
        APP_CLIENT_ID: "12sll7nrfj4eqsnmed52n0asvs",
        IDENTITY_POOL_ID: "eu-west-2:1a5451f6-83a9-46fb-9c19-9fd5676128bb"
    },
    apiGateway: {
        REGION: "eu-west-2",
        URL: "https://api.excite.world/prod",
        WS_ENDPOINT: "wss://p1wtmwcvea.execute-api.eu-west-2.amazonaws.com/prod"
    },
    stripe: {
        STRIPE_PUBLIC_KEY: "pk_test_Ua3dPWghEeL733J86S3Okzie00nTYcMZJC"
    }
};

const config = process.env.REACT_APP_STAGE === 'prod' ? prod : dev;
export default config;