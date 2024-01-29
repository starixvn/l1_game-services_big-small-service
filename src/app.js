import appConfigs from "./app-configs";
import gameSettings from "./game-settings";
import { startTrace } from "sc-instrument";

startTrace(appConfigs.otel?.enabled, appConfigs.otel?.endpoint, appConfigs.otel?.system, appConfigs.sentry.env, gameSettings.name);

import { Core } from "sc-game-base";
import { GameData } from "sc-pool-betting-game-base";

import BigSmallContainerRegistry from "./big-small-container-registry";
import { generateRawResultForHash, generateResult, getSettlementResult } from "./helpers";
import BigSmallDefinition from "./big-small-definition";

const run = async () => {
    const gameData = new GameData(gameSettings.durations.wholeRound);
    const definition = new BigSmallDefinition(gameSettings, generateResult, getSettlementResult, generateRawResultForHash);
    const container = new BigSmallContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp("BigSmall", appConfigs);
    await app.run();
    await app.startGame(container);
};

run();
