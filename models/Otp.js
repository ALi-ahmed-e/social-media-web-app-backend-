import mongoose from "mongoose";


const OtpSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true
    },
    otp:String,
    expiresAt:Date,
    createdAt:Date

})




export default mongoose.model("Otp", OtpSchema);