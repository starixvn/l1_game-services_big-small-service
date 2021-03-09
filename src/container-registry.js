import { asClass, asValue } from "awilix";
import { ContainerRegistry } from "sc-pool-betting-game-base";

import { BigSmallBetLogs, BigSmallBets, BigSmallRounds } from "./models";
import { BigSmallRoundQuery } from "./query-apis";

export default class BigSmallContainerRegistry extends ContainerRegistry {
    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(BigSmallRounds),
            betsRepository: asValue(BigSmallBets),
            betLogsRepository: asValue(BigSmallBetLogs),
        });
    }

    registerApis() {
        super.registerApis();

        this.container.register({
            roundQuery: asClass(BigSmallRoundQuery).singleton(),
        });
    }
}
