import { asValue } from "awilix";
import { ContainerRegistry } from "sc-pool-betting-game-base";

import { MiniSicBoBetLogs, MiniSicBoBets, MiniSicBoRounds } from "./models";

export default class MiniSicBoContainerRegistry extends ContainerRegistry {
    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(MiniSicBoRounds),
            betsRepository: asValue(MiniSicBoBets),
            betLogsRepository: asValue(MiniSicBoBetLogs),
        });
    }
}
