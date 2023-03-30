import { Router } from 'express'
const router = Router()
import jwt from 'jsonwebtoken'
import verifyRefreshToken from '../utils/verifyRefrshTokens.js'


//get new access token
router.post("/", async (req, res) => {

    if (!req.cookies.refresh_token) return res.status(400).send('you are not logged in')



    try {
        const { tokenDetails } = await verifyRefreshToken(req.cookies.refresh_token)
        const accessToken = jwt.sign({ id: tokenDetails.id }, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: "1d" })
        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
        res.status(200).send({ message: 'successfuly set new refresh token' })
    } catch (error) {
        res.status(400).send(error.message)
    }

})



export default router;