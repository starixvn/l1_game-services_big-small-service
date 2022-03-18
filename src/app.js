import { Core } from "sc-game-base";
import { GameData } from "sc-pool-betting-game-base";

import appConfigs from "./app-configs";
import BigSmallContainerRegistry from "./big-small-container-registry";
import gameSettings from "./game-settings";
import { generateRawResultForMd5, generateResult, getSettlementResult } from "./helpers";

const run = async () => {
    const gameData = new GameData(gameSettings.durations.wholeRound);
    const definition = new Core.GameDefinition(gameSettings, generateResult, getSettlementResult, generateRawResultForMd5);
    const container = new BigSmallContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp("BigSmall", appConfigs);
    await app.run();
    await app.startGame(container);
};

run();
