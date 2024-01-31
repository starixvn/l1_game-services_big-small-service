import getHistoryTest from "./get-history.test";
import inGameTest from "./in-game.test";
import placeBetTest from "./place-bet.test";
import { startServiceProcess, startSetupDataProcess } from "./stubs/test-jobs";
import { boostedOddsTest } from "./boosted-odds.test";
import balancedPlaceBetTest from "./balanced-place-bet.test";

let processStartService;

const JEST_ASSERT_WAITING_RESPONSE_TIMEOUT = 140000;

beforeAll((done) => {
    jest.setTimeout(JEST_ASSERT_WAITING_RESPONSE_TIMEOUT);
    startSetupDataProcess(() => {
        processStartService = startServiceProcess(() => {
            setTimeout(() => {
                console.log("start tests");
                done();
            }, 15000);
        });
    });
});

afterAll(() => {
    processStartService.stdin.pause();
    processStartService.kill();
});

// boostedOddsTest();
inGameTest();
// getHistoryTest();
// placeBetTest();
// balancedPlaceBetTest();
