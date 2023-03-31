import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
        , unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    roles: {
        type: [String],
        enum: ['user', 'admin', 'super Admin'],
        default: ['user'],
        required: true
    },
    profileImage: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        default: ''
    },
    following: {
        type: [String],
        required: true,
        default: []
    },
    followers: {
        type: [String],
        required: true,
        default: []
    },
    bio:{
        type: String,
        default:''
    },
    verfied: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export default mongoose.model('User', UserSchema)