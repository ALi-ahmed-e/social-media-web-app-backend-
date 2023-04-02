import dotenv from "dotenv"
dotenv.config()
import express from 'express'
import cors from 'cors'
import dbConnect from './connectToDB.js'
import authRoute from './routes/auth.js'
import usersRoute from './routes/user.js'
import postsRoute from './routes/posts.js'
import storiesRoute from './routes/storie.js'
import refreshTokenRoute from './routes/refreshToken.js'
import cookieParser from 'cookie-parser'
import authMiddleware from "./middleware/authMiddleware.js"
const port = process.env.PORT || 8000
const app = express()

app.use(express.static('./dist'))


dbConnect()

app.use(cors({
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}))
app.use(express.json({ limit: '50mb' }))
app.use(cookieParser());

app.use("/api", authRoute)
app.use("/api/refreshToken", refreshTokenRoute)
app.use("/api/user", authMiddleware, usersRoute)
app.use("/api/posts", authMiddleware, postsRoute)
app.use("/api/stories", authMiddleware, storiesRoute)
app.use("*",express.static('./dist'))
app.listen(port, () => console.log('listening on ' + port))










