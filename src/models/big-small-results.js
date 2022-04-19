import mongoose from "mongoose";
import { Core } from "sc-game-base";

export const BigSmallResults = mongoose.model("TaiXiu_results", Core.Models.ResultSchema);
