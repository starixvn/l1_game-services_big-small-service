const game = {
    id: 1,
    name: "taixiu",
};

const currencyData = { code: "USD", name: "$US" };

const socketOptions = {
    socketUri: "http://localhost:5001/user/taixiu",
    gameName: game.name,
    proxyRoute: "/socket.io",
};

const gameConfig = {
    type: 0,
    name: "taixiu",
    minBet: 1,
    maxBet: 2000,
    odds: { big: 1.97, small: 1.97 },
};

const rounds = [
    {
        id: 823209,
        result: { dice1: 1, dice2: 2, dice3: 6 },
        settlementResult: { big: false, small: true },
    },
    {
        id: 823210,
        result: { dice1: 4, dice2: 4, dice3: 1 },
        settlementResult: { big: false, small: true },
    },
    {
        id: 823211,
        result: { dice1: 1, dice2: 5, dice3: 3 },
        settlementResult: { big: false, small: true },
    },
];

export { game, currencyData, socketOptions, gameConfig, rounds };
