import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
    {
        dice1: { type: Boolean, required: true },
        dice2: { type: Boolean, required: true },
        dice3: { type: Boolean, required: true },
    },
    { _id: false }
);

const settlementResultSchema = new mongoose.Schema(
    {
        odd: { type: Boolean, default: false },
        even: { type: Boolean, default: false },
    },
    { _id: false }
);

const Schema = new mongoose.Schema({
    id: { type: Number, required: true },
    result: resultSchema,
    settlementResult: settlementResultSchema,
    time: { type: Date, default: new Date() },
});

export const BigSmallRounds = mongoose.model("TaiXiu_phien", Schema);
