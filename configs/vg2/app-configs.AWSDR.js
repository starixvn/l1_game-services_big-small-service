export default {
    hostingPort: 5000,
    apiSettings: {
        enabledApi: true,
        apiUrl: "http://l2_game_api_awsdr:5000",
        authUrl: "http://l2_auth_api_awsdr:5000",
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
        url: "http://l2_auth_api_awsdr:5000",
        id: "game-services",
        secret: "gameservices@20luminet&",
        requestTimeout: 10000,
        useAuthenticate: true,
        audiences: ["api", "admin-api"],
    },
    userServiceSettings: {
        url: "http://l2_user_service_awsdr:5000",
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
        url: "mongodb://lmn_backend:ilthODrRz8C4s2%5D%7B%7CLV%3Du%5D2vsf6o%5Ex0m@10.88.127.158:37101/?replicaSet=SabaL2DR",
        options: {
            dbName: "minigame",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    sentry: {
        sentryUrl: "http://8ac47fca6d3e4a41908896a64ef201ac@10.2.189.51:9009/53",
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
            boostedOdds: -1001650118408,
        },
    },
    enabledBoostedOdds: true,
    balancedBotBettingTime: 10,
    otel: {
        system: "VG",
        enabled: true,
        endpoint: "http://10.2.189.50:4318/v1/traces",
    },
};
