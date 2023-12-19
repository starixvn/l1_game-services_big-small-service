import mongoose from "mongoose";

const betLog = {
    uid: { type: String, required: true },
    name: { type: String, required: true },

    choice: { type: String, required: true },
    amount: { type: Number, required: true },
    baseAmount: { type: Number, required: true },

    refund: { type: Number, default: 0 },
    baseRefund: { type: Number, default: 0 },
    win: { type: Boolean, default: false },
    betwin: { type: Number, default: 0 },
    baseBetWin: { type: Number, default: 0 },
    totalWin: { type: Number, default: 0 },
    baseTotalWin: { type: Number, default: 0 },
    time: { type: Date },
    odds: { type: Object },

    siteId: { type: String },
    currency: { type: String, required: true },
    rate: { type: Number, required: true },

    playerId: { type: String },
    operatorId: { type: String, required: true },
    roundId: { type: Number, required: true },
    paid: { type: Boolean, default: false },
};

const bet = {
    ...betLog,
    odds: { type: Object },
    totalAmount: { type: Number, default: 0 },
};

export const BigSmallBets = mongoose.model("TaiXiu_one", new mongoose.Schema(bet));
export const BigSmallBetLogs = mongoose.model("TaiXiu_cuoc", new mongoose.Schema(betLog));
