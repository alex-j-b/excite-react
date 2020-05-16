
const dev = {
    cognito: {
        REGION: "eu-west-2",
        USER_POOL_ID: "eu-west-2_M2Ye9mmsk",
        APP_CLIENT_ID: "418t71eo1i5rsd0pbajj70pivs",
        IDENTITY_POOL_ID: "eu-west-2:0d70f208-9aef-4c3b-b4fd-056ebf1fa8b7"
    },
    apiGateway: {
        REGION: "eu-west-2",
        URL: "https://api.excite.world/dev",
        SOCKET_ENDPOINT: "wss://8v8ywxnj6f.execute-api.eu-west-2.amazonaws.com/dev"
    },
    stripe: {
        STRIPE_PUBLIC_KEY: "pk_test_Ua3dPWghEeL733J86S3Okzie00nTYcMZJC"
    }
};

const prod = {
    cognito: {
        REGION: "eu-west-2",
        USER_POOL_ID: "eu-west-2_B4Dcwg8xW",
        APP_CLIENT_ID: "5gmvjliprh7cq7sm35cdecseu8",
        IDENTITY_POOL_ID: "eu-west-2:5e230cfe-0df1-488e-89df-d66250466523"
    },
    apiGateway: {
        REGION: "eu-west-2",
        URL: "https://api.excite.world/prod",
        SOCKET_ENDPOINT: "wss://ao6phean1m.execute-api.eu-west-2.amazonaws.com/prod"
    },
    stripe: {
        STRIPE_PUBLIC_KEY: "pk_test_Ua3dPWghEeL733J86S3Okzie00nTYcMZJC"
    }
};

const config = process.env.REACT_APP_STAGE === 'prod' ? prod : dev;
export default config;