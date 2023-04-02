import mongoose from "mongoose";


const storieSchema = new mongoose.Schema({
    userId: mongoose.Types.ObjectId,
    text: {
        type: String,
    },
    image: {
        type: String,
    },
    video: {
        type: String,
    },
    "expireAt": { type: Date,default:Date.now(),  expires:86400}
},{timestamps:true})


export default mongoose.model("Storie", storieSchema);