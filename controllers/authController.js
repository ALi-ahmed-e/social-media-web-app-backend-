import { loginBodyValidation, signUpBodyValidation } from '../utils/validationSchema.js'
import bcrypt from 'bcrypt'
import User from '../models/User.js'
import generateTokens from "../utils/generateTokens.js";
import UserToken from '../models/UserToken.js';
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import Otp from '../models/Otp.js'


//sign up
const signUp = async (req, res) => {

    try {
        const { error } = signUpBodyValidation(req.body)

        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }
        const user = await User.findOne({ email: req.body.email })

        if (user) {
            return res.status(400).json({ message: 'User already exists' })
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            profileImage: `https://ui-avatars.com/api/?background=random&name=${req.body.username}&format=png`
        })

        const { accessToken, refreshToken } = await generateTokens(newUser._doc)

        const { password, ...clientUser } = newUser._doc

        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })

        res.status(201).json({
            user: clientUser
        })


    } catch (error) {

        res.status(500).json({
            message: error.message
        })

    }
}

//login
const signIn = async (req, res) => {

    try {
        const { error } = loginBodyValidation(req.body)

        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }
        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(400).send({ message: 'invalid email or password' })
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password)

        if (!validPassword) {
            return res.status(401).json({ message: 'invalid email or password' })
        }

        const { accessToken, refreshToken } = await generateTokens(user)

        const { password, ...clientUser } = user._doc

        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })

        res.status(200).json({
            user: clientUser
        })


    } catch (error) {

        res.status(500).json({
            message: error.message
        })

    }
}

// logout
const signOut = async (req, res) => {
    const token = req.cookies.refresh_token
    try {
        if (!token) return res.status(400).send("token is required")

        const userToken = await UserToken.findOne({ token });

        if (!userToken) return res.status(200).json({ error: false, message: "Logged Out Sucessfully" });

        await UserToken.findByIdAndRemove(userToken._id)

        res.clearCookie("access_token")
        res.clearCookie("refresh_token")

        res.status(200).json({ error: false, message: "Logged Out Sucessfully" });

    } catch (err) {
        res.status(500).json({ error: true, message: err.message });
    }

}

//check logged in
const checkLoggedIn = async (req, res) => {
    const token = req.cookies.access_token
    try {
        if (!token) { res.status(400).json({ message: "you are not logged in" }) }


        const tokenDetails = jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY)


        if (!tokenDetails) { res.status(400).json({ message: "you are not logged in" }) }


        const resp = await User.findById(tokenDetails.id)


        const { password, ...user } = resp._doc



        res.status(200).json({ error: false, user });

    } catch (err) {
        res.status(500).json({ error: true, message: err.message });
    }

}



// verfiy account
const verfiyAccount = async (req, res) => {
    const email = req.body.email

    const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.NODE_MAILER_USER,
            pass: process.env.NODE_MAILER_PASS
        },
    })

    try {
        await Otp.deleteOne({ email })

        const OTP = Math.floor(Math.random() * 9000) + 1000;



        const details = {
            from: process.env.NODE_MAILER_USER,
            to: email,
            subject: "Verfiy your social account",
            html: `<h1 style="color:red">${OTP}</h1>`
        }

        mailTransporter.sendMail(details, async (error) => {
            if (error) {
                res.status(400).json({ message: error })
            } else {


                const hashedOtp = await bcrypt.hash(OTP.toString(), 10)


                const newotp = await Otp.create({
                    email,
                    otp: hashedOtp,
                    expiresAt: Date.now() + 3600000,
                    createdAt: Date.now(),
                })


                res.status(200).json({ message: "OTP sent to your email" })
            }
        })



    } catch (error) {
        res.status(400).json({ message: error, error: true })
    }




}

const verfiyAccountOtp = async (req, res) => {
    const { email, otp } = req.body
    try {
        if (!(email && otp)) {
            res.status(400).json({ message: error.message })
        }
        const matchedOtpRec = await Otp.findOne({ email })
        if (!matchedOtpRec) {
            res.status(400).json({ message: "No otp rec found" })
        }
        if (matchedOtpRec.expiresAt < Date.now()) {
            await Otp.deleteOne({ email })
            res.status(400).json({ message: " otp expired" })
        }


        const match = await bcrypt.compare(otp, matchedOtpRec.otp)

        if (match) {
            await Otp.deleteOne({ email })
            await User.updateOne({ email }, { verfied: match })
            res.status(200).json({ message: 'account verfied successfuly' })
        }










        // res.status(200).json({ message: match })

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//login
const deleteUser = async (req, res) => {
    try {

        const user = await User.findOne({ email: req.user.email })

        if (!user) {
            return res.status(400).send({ message: 'error occurd' })
        }


        const validPassword = await bcrypt.compare(req.body.password, user.password)

        if (!validPassword) {
            return res.status(401).json({ message: 'invalid password' })
        }


        res.cookie("access_token")
        res.cookie("refresh_token")

        res.status(200).json({
            message: 'ccount deleted successfully'
        })


    } catch (error) {

        res.status(500).json({
            message: error.message
        })

    }
}






export {
    signUp,
    signIn,
    signOut,
    checkLoggedIn,
    verfiyAccount,
    deleteUser,
    verfiyAccountOtp,

}