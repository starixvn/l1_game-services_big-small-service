import { asValue, asClass } from "awilix";
import { ContainerRegistry } from "sc-pool-betting-game-base";
import BigSmallPlaceBetConsumer from "./consumers/big-small-place-bet-consumer";

import { BigSmallBetLogs, BigSmallBets, BigSmallResults, BigSmallRounds } from "./models";

export default class BigSmallContainerRegistry extends ContainerRegistry {
    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(BigSmallRounds),
            betsRepository: asValue(BigSmallBets),
            betLogsRepository: asValue(BigSmallBetLogs),
            resultsRepository: asValue(BigSmallResults),
        });
    }

    registerConsumers() {
        super.registerConsumers();

        this.container.register({
            placeBetConsumer: asClass(BigSmallPlaceBetConsumer).singleton(),
        });
    }
}
