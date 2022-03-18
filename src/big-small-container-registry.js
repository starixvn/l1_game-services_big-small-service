import { asValue } from "awilix";
import { ContainerRegistry } from "sc-pool-betting-game-base";

import { BigSmallBetLogs, BigSmallBets, BigSmallMD5s, BigSmallRounds } from "./models";

export default class BigSmallContainerRegistry extends ContainerRegistry {
    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(BigSmallRounds),
            betsRepository: asValue(BigSmallBets),
            betLogsRepository: asValue(BigSmallBetLogs),
            md5sRepository: asValue(BigSmallMD5s),
        });
    }
}
