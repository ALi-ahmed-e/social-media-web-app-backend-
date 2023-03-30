import jwt from 'jsonwebtoken'
import UserToken from '../models/UserToken.js'

const verifyRefreshToken = (refreshToken) => {

    const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY

    return new Promise(async (resolve, reject) => {

        const doc = await UserToken.findOne({ token: refreshToken })


        if (!doc) {
            return reject({ message: "invalid refresh token" })
        }

        jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {

            if (err) {

                return reject({ message: "invalid refresh token" })

            }

            resolve({ tokenDetails, message: "valid refresh token" })

        })


    })


}



export default verifyRefreshToken