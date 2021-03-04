import mongoose from "mongoose";

const betLog = {
    uid: { type: String, required: true },
    name: { type: String, required: true },
    phien: { type: Number, required: true },

    choice: { type: String, required: true },
    amount: { type: Number, required: true },

    thanhtoan: { type: Boolean, default: false },
    refund: { type: Number, default: 0 },
    win: { type: Boolean, default: false },
    betwin: { type: Number, default: 0 },
    time: { type: Date },

    memberId: { type: Number },
    siteId: { type: String },
};

const bet = {
    ...betLog,
    totalAmount: { type: Number, default: 0 },
};

export const BigSmallBets = mongoose.model("TaiXiu_one", new mongoose.Schema(bet));
export const BigSmallBetLogs = mongoose.model("TaiXiu_cuoc", new mongoose.Schema(betLog));
