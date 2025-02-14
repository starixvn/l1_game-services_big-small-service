import { ProcessBetQueue } from "sc-pool-betting-game-base";

export default class BigSmallProcessBetQueue extends ProcessBetQueue {
    isCountOnTotalBets(player) {
        return this.gameData.currencies.some(
            (currency) =>
                currency.partnerId === player.session.operatorId &&
                currency.name === player.session.currencyName &&
                !(currency.isTest && currency.isUncountOnTotal)
        );
    }
}
