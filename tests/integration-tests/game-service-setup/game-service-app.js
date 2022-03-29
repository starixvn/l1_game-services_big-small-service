import { Core } from "sc-game-base";
import { initAPIStub } from "sc-game-service-integration-utils";
import { GameData } from "sc-pool-betting-game-base";

import appConfigs from "../../../src/app-configs";
import BigSmallContainerRegistry from "../../../src/big-small-container-registry";
import gameSettings from "../../../src/game-settings";
import { generateRawResultForHash, generateResult, getSettlementResult } from "../../../src/helpers";

const run = async () => {
    initAPIStub(appConfigs.apiSettings.apiUrl);
    const gameData = new GameData(gameSettings.durations.wholeRound);
    const definition = new Core.GameDefinition(gameSettings, generateResult, getSettlementResult, generateRawResultForHash);
    const container = new BigSmallContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp("BigSmall", appConfigs);
    await app.run();
    await app.startGame(container);
};

run();
