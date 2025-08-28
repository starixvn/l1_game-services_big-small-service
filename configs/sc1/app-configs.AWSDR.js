export default {
    hostingPort: 5000,
    apiSettings: {
        enabledApi: true,
        apiUrl: "http://l1_game_api_awsdr:5000",
        authUrl: "http://l1_auth_api_awsdr:5000",
        client: {
            id: "game-server",
            secret: "gameserver@20luminet&",
        },
        useAuthenticate: true,
        placeBetTimeout: 4000,
        requestTimeout: 10000, // 10s
        enabledApiLogs: true,
    },
    authenticateSettings: {
        url: "http://l1_auth_api_awsdr:5000",
        id: "game-services",
        secret: "gameservices@20luminet&",
        requestTimeout: 10000,
        useAuthenticate: true,
        audiences: ["api", "admin-api"],
    },
    userServiceSettings: {
        url: "http://l1_user_service_awsdr:5000",
    },
    socketOptions: {
        pingInterval: 60 * 1000,
        pingTimeout: 60 * 1000,
        transports: ["websocket"],
        allowUpgrades: false,
        perMessageDeflate: false,
    },
    enabledLogs: true,
    database: {
        url: "mongodb://lmn_backend:Sb%7B5r%40Xy4X%256%28%24%5Bt%252HsOxJ%7CQt9jdR%26t@10.88.127.158:27101/?replicaSet=SabaL1DR",
        options: {
            dbName: "minigame",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    sentry: {
        sentryUrl: "http://52368c4019044019885440599c180bda@10.2.189.51:9009/24",
        logIdentifier: "big-small",
        env: "DR",
    },
    adminSecretKey: "asWDEer4yGdgsdqR4uqmKQZgh",
    metrics: {
        enable: true,
        secretKey: "30d15293-c7de-4c77-9293-b85d6c5bfe1a",
    },
    enableMsgpackParser: true,
    chatBotSettings: {
        url: "https://bot.nexdev.net/skynex/api/messages/",
        token: "0A40aOc7CtpzjbBSJu8KNWQRoXyjRvf9",
        requestTimeout: 5000,
        conversationIds: {
            boostedOdds: -1001540066241,
        },
    },
    enabledBoostedOdds: true,
    balancedBotBettingTime: 10,
    otel: {
        system: "SG",
        enabled: true,
        endpoint: "http://10.2.189.50:4318/v1/traces",
    },
};
