import mongoose from "mongoose";
import { Core } from "sc-game-base";

export const BigSmallMD5s = mongoose.model("TaiXiu_md5s", Core.Models.MD5Schema);
