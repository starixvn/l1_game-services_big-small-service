import { errorUser, GameClientDriver, internalServerErrorUser, normalUser } from "sc-game-service-integration-utils";

import { currencyData, socketOptions } from "./stubs/test-data";

const JEST_ASSERT_WAITING_RESPONSE_TIMEOUT = 60000;
const WAITING_END_GAME_TIMEOUT = 50000;

describe("BigSmall Service", () => {
    beforeAll(() => {
        // set timeout for jest, waiting for socket response
        jest.setTimeout(JEST_ASSERT_WAITING_RESPONSE_TIMEOUT);
    });

    describe("Happy Path Cases", () => {
        let gameClientDriver;
        beforeAll(() => {
            // Arrange
            gameClientDriver = new GameClientDriver(socketOptions, initUserSession(normalUser));
        });

        afterAll(() => {
            gameClientDriver.close();
        });

        it("should start and allow game client connect to.", (done) => {
            // Assert
            gameClientDriver.handleSignedInEvent(() => {
                done();
            });
        });

        it("should return game configuration (odds, min bet, max bet) when user joins game.", (done) => {
            // Arrange
            const expectedGameConfigs = {
                minBet: 1,
                maxBet: 2000,
                maxBetPerChoices: {},
                odds: { big: 1.97, small: 1.97 },
            };

            // Act
            gameClientDriver.sendInGameEvent();

            // Assert
            gameClientDriver.handleInGameEvent((inGameData) => {
                if (inGameData?.gameConfigs) {
                    if (inGameData.gameConfigs) {
                        expect(inGameData.gameConfigs.minBet).toEqual(expectedGameConfigs.minBet);
                        expect(inGameData.gameConfigs.maxBet).toEqual(expectedGameConfigs.maxBet);
                        expect(inGameData.gameConfigs.odds).toStrictEqual(expectedGameConfigs.odds);

                        done();
                    }
                }
            });
        });
        it("should return user information when user joins game.", async (done) => {
            // Arrange
            const expectedUser = {
                UID: 1,
                avatarId: 1,
                currency: "$US",
                name: "NormalUser",
                rate: 1,
                red: 25000,
            };

            // Act
            gameClientDriver.sendInGameEvent();

            // Assert
            gameClientDriver.handleInGameEvent((inGameData) => {
                if (inGameData?.user?.UID) {
                    expect(inGameData.user).toStrictEqual(expectedUser);

                    done();
                }
            });
        });

        it("should return old round history when user joins game", (done) => {
            // Arrange
            const expectedRoundHistory = [
                {
                    roundId: 823211,
                    result: { dice1: 1, dice2: 5, dice3: 3 },
                    settlementResult: { big: false, small: true },
                },
                {
                    roundId: 823210,
                    result: { dice1: 4, dice2: 4, dice3: 1 },
                    settlementResult: { big: false, small: true },
                },
                {
                    roundId: 823209,
                    result: { dice1: 1, dice2: 2, dice3: 6 },
                    settlementResult: { big: false, small: true },
                },
            ];

            // Act
            gameClientDriver.sendInGameEvent();

            // Assert
            gameClientDriver.handleInGameEvent((inGameData) => {
                if (inGameData?.roundHistory) {
                    expect(inGameData.roundHistory).toStrictEqual(expectedRoundHistory);
                    done();
                }
            });
        });

        it("should return current user ticket result when user is playing game.", async (done) => {
            // Arrange
            const betChoice = "big";
            const amount = 100;

            const expectedEndBetResponse = {
                ownBets: { big: 100 },
                endBet: 100,
                betChoice: "big",
                freeBet: false,
                user: { maxBet: 2000, minBet: 1, red: 24250, scoins: 0 },
            };

            // Act
            await gameClientDriver.sendBetEvent(betChoice, amount);

            // Assert
            gameClientDriver.handleEndBetEvent((endBetData) => {
                if (endBetData.endBet) {
                    expect(endBetData).toStrictEqual(expectedEndBetResponse);
                    done();
                }
            });
        });

        it("should return bet history when user request", async (done) => {
            // Arrange
            await new Promise((r) => setTimeout(r, WAITING_END_GAME_TIMEOUT));

            // Act
            gameClientDriver.sendGetHistoryEvent();

            // Assert
            gameClientDriver.handleGetHistoryEvent((betHistoryData) => {
                if (betHistoryData?.history) {
                    expect(betHistoryData.history.betLogs.length > 0).toBeTruthy();
                    done();
                }
            });
        });
    });

    describe("Unhappy Path Cases", () => {
        it("should return error when place bet failed", async (done) => {
            // Arrange
            const betChoice = "big";
            const amount = 100;
            const gameClientDriver = new GameClientDriver(socketOptions, initUserSession(errorUser));
            gameClientDriver.handleSignedInEvent(() => {
                gameClientDriver.sendInGameEvent();
            });

            // Act
            await gameClientDriver.sendBetEvent(betChoice, amount);

            // Assert
            gameClientDriver.handleEndBetEvent((endBetData) => {
                if (endBetData.endBet === -1) {
                    expect(endBetData.betChoice).toEqual("big");
                    expect(endBetData.apiError.errorCode).toEqual(3002);
                    expect(endBetData.apiError.isPlaceBetFailed).toEqual(true);
                    done();
                    gameClientDriver.close();
                }
            });
        });

        it("should return error when get internal server error from api", async (done) => {
            // Arrange
            const gameClientDriver = new GameClientDriver(socketOptions, initUserSession(internalServerErrorUser));
            gameClientDriver.handleSignedInEvent(() => {
                gameClientDriver.sendInGameEvent();
            });
            const betChoice = "big";
            const amount = 100;

            // Act
            await gameClientDriver.sendBetEvent(betChoice, amount);

            // Assert
            gameClientDriver.handleEndBetEvent((endBetData) => {
                if (endBetData.endBet === -1) {
                    expect(endBetData.betChoice).toEqual("big");
                    expect(endBetData.apiError.errorCode).toEqual("SB1900");
                    expect(endBetData.apiError.isPlaceBetFailed).toEqual(true);
                    done();
                    gameClientDriver.close();
                }
            });
        });
    });
});

const initUserSession = (user) => {
    return {
        session: `${user.memberId}-session-id`,
        ss: `${user.memberId}-session-id`,
        currency: currencyData.name,
        username: `${user.memberId}_${user.memberName}`,
        browserUserAgent: "browser-user-agent",
    };
};
