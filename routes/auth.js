import { Router } from "express";
import { checkLoggedIn, signIn, signOut, signUp, verfiyAccount, verfiyAccountOtp } from "../controllers/authController.js";



const router = Router()

// signUp
router.post('/signup', signUp)

//sign in
router.post('/login', signIn)

//logout
router.post('/logout', signOut)

//check logged in
router.post('/checkLoggedIn', checkLoggedIn)

//verfiy email
router.post('/verfiyemail',verfiyAccount)

//verfiy otp
router.post('/verfiyemailotp',verfiyAccountOtp)



export default router