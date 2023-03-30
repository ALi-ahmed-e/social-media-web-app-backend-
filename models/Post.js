import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema({

    comment: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    video: {
        type: String,
    },
    user: mongoose.Types.ObjectId,

}, { timestamps: true })



const PostSchema = new mongoose.Schema({
    userId: mongoose.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    video: {
        type: String,
    },
    likes: {
        type: Array,
        default: []
    },
    comments: {
        type: [commentsSchema],
        default: []
    },

}, { timestamps: true })

export default mongoose.model("Post", PostSchema);