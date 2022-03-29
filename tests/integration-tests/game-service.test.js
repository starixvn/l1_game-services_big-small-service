import { errorUser, GameClientDriver, internalServerErrorUser, normalUser } from "sc-game-service-integration-utils";

import gameSettings from "../../src/game-settings";
import { currencyData, socketOptions } from "./stubs/test-data";
import { startServiceProcess, startSetupDataProcess } from "./stubs/test-jobs";

let processStartService;

const JEST_ASSERT_WAITING_RESPONSE_TIMEOUT = 100000;

beforeAll((done) => {
    jest.setTimeout(JEST_ASSERT_WAITING_RESPONSE_TIMEOUT);
    startSetupDataProcess(() => {
        processStartService = startServiceProcess(() => {
            done();
        });
    });
});

afterAll(() => {
    processStartService.stdin.pause();
    processStartService.kill();
});

describe("BigSmall Service", () => {
    describe("when user join game", () => {
        let driver;
        beforeAll((done) => {
            driver = new GameClientDriver(socketOptions, initUserSession(normalUser));
            driver.handleSignedInEvent(() => {
                done();
            });
        });

        afterAll(() => {
            driver.close();
        });

        // Arrange
        const expectedGameConfigs = {
            minBet: 1,
            maxBet: 2000,
            odds: { big: 1.97, small: 1.97 },
        };

        const expectedUser = {
            UID: 1,
            avatarId: 1,
            currency: "$US",
            name: "NormalUser",
            rate: 1,
            red: 25000,
        };

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

        it("should return game configuration (odds, min bet, max bet)", (done) => {
            // Act
            driver.sendInGameEvent();

            // Assert
            driver.handleInGameEvent((inGameData) => {
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

        it("should return user information", (done) => {
            // Act
            driver.sendInGameEvent();

            // Assert
            driver.handleInGameEvent((inGameData) => {
                if (inGameData?.user?.UID) {
                    expect(inGameData.user).toStrictEqual(expectedUser);

                    done();
                }
            });
        });

        it("should return old round history", (done) => {
            // Act
            driver.sendInGameEvent();

            // Assert
            driver.handleInGameEvent((inGameData) => {
                if (inGameData?.roundHistory) {
                    expect(inGameData.roundHistory).toStrictEqual(expectedRoundHistory);
                    done();
                }
            });
        });
    });

    describe("when user view bet history", () => {
        let driver;
        beforeAll((done) => {
            driver = new GameClientDriver(socketOptions, initUserSession(normalUser));
            driver.handleSignedInEvent(() => {
                done();
            });
        });

        afterAll(() => {
            driver.close();
        });

        it("should return bet history", (done) => {
            // Arrange
            const expectedData = [
                {
                    refund: 0,
                    baseRefund: 0,
                    win: false,
                    betwin: 0,
                    baseBetWin: 0,
                    totalWin: 0,
                    baseTotalWin: 0,
                    totalAmount: 0,
                    phien: 823211,
                    currency: "$US",
                    amount: 100,
                    baseAmount: 100,
                    choice: "small",
                    name: "NormalUser",
                    partnerId: "dummy-partner-id",
                    rate: 1,
                    betLogDetails: [],
                },
                {
                    refund: 0,
                    baseRefund: 0,
                    win: false,
                    betwin: 0,
                    baseBetWin: 0,
                    totalWin: 0,
                    baseTotalWin: 0,
                    totalAmount: 0,
                    phien: 823211,
                    currency: "$US",
                    amount: 100,
                    baseAmount: 100,
                    choice: "big",
                    name: "NormalUser",
                    partnerId: "dummy-partner-id",
                    rate: 1,
                    betLogDetails: [],
                },
            ];

            // Act
            driver.sendGetHistoryEvent();

            // Assert
            driver.handleGetHistoryEvent((betHistoryData) => {
                if (betHistoryData?.history) {
                    const actualBetLogs = betHistoryData.history.betLogs.map((betLog) => {
                        delete betLog.result;
                        delete betLog.settlementResult;
                        return betLog;
                    });

                    expect(actualBetLogs).toEqual(expectedData);
                    done();
                }
            });
        });
    });

    describe("when user place bet", () => {
        // Arrange
        const betChoice = "big";
        const amount = 100;

        describe("when place bet successful", () => {
            let driver;
            let receivedRemainingTime = false;
            beforeAll((done) => {
                driver = new GameClientDriver(socketOptions, initUserSession(normalUser));
                driver.handleSignedInEvent(() => {
                    driver.sendInGameEvent();
                });
                driver.handleInGameEvent((inGameData) => {
                    if (!receivedRemainingTime && inGameData.remainingTime) {
                        receivedRemainingTime = true;
                        setTimeout(() => {
                            driver.sendBetEvent(betChoice, amount);
                        }, getTimeOutToBet(inGameData.remainingTime, gameSettings.durations) * 1000);

                        done();
                    }
                });
            });

            afterAll(() => {
                driver.close();
            });

            it("should return current user ticket result", (done) => {
                const expectedEndBetResponse = {
                    ownBets: { big: 100 },
                    endBet: 100,
                    betChoice: "big",
                    freeBet: false,
                    user: { maxBet: 2000, minBet: 1, red: 24250, scoins: 0 },
                };

                // Assert
                driver.handleEndBetEvent((endBetData) => {
                    if (endBetData.endBet) {
                        expect(endBetData).toStrictEqual(expectedEndBetResponse);
                        done();
                    }
                });
            });

            it("should return ticket status when end game", (done) => {
                // Assert
                driver.handleEndGameEvent((endGameResult) => {
                    if (endGameResult.status) {
                        done();
                    }
                });
            });
        });

        describe("when API has internal server error", () => {
            let driver;
            let receivedRemainingTime = false;
            beforeAll((done) => {
                driver = new GameClientDriver(socketOptions, initUserSession(internalServerErrorUser));
                driver.handleSignedInEvent(() => {
                    driver.sendInGameEvent();
                });
                driver.handleInGameEvent((inGameData) => {
                    if (!receivedRemainingTime && inGameData.remainingTime) {
                        receivedRemainingTime = true;
                        setTimeout(() => {
                            driver.sendBetEvent(betChoice, amount);
                        }, getTimeOutToBet(inGameData.remainingTime, gameSettings.durations) * 1000);
                        done();
                    }
                });
            });

            afterAll(() => {
                driver.close();
            });

            it("should return api error to client", () => {
                // Assert
                driver.handleEndBetEvent((endBetData) => {
                    if (endBetData.endBet === -1) {
                        expect(endBetData.betChoice).toEqual("big");
                        expect(endBetData.apiError.errorCode).toEqual("SB1900");
                        expect(endBetData.apiError.isPlaceBetFailed).toEqual(true);
                        done();
                    }
                });
            });
        });

        describe("When API response error", () => {
            let driver;
            let receivedRemainingTime = false;
            beforeAll((done) => {
                driver = new GameClientDriver(socketOptions, initUserSession(errorUser));
                driver.handleSignedInEvent(() => {
                    driver.sendInGameEvent();
                });
                driver.handleInGameEvent((inGameData) => {
                    if (!receivedRemainingTime && inGameData.remainingTime) {
                        receivedRemainingTime = true;
                        setTimeout(() => {
                            driver.sendBetEvent(betChoice, amount);
                        }, getTimeOutToBet(inGameData.remainingTime, gameSettings.durations) * 1000);
                        done();
                    }
                });
            });

            afterAll(() => {
                driver.close();
            });

            it("should return api error to client", () => {
                // Assert
                driver.handleEndBetEvent((endBetData) => {
                    if (endBetData.endBet === -1) {
                        expect(endBetData.betChoice).toEqual("big");
                        expect(endBetData.apiError.errorCode).toEqual("SB1900");
                        expect(endBetData.apiError.isPlaceBetFailed).toEqual(true);
                        done();
                    }
                });
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

const getTimeOutToBet = (remainingTime, durations) => {
    let timeout = 0;
    if (remainingTime <= durations.lockingBet) {
        timeout = durations.wholeRound - durations.placingBets + remainingTime + 4;
    } else if (remainingTime > durations.placingBets) {
        timeout = durations.wholeRound - durations.placingBets + 4;
    }

    return timeout;
};
