import jwt from 'jsonwebtoken'
import UserToken from '../models/UserToken.js'

const generateTokens = async (user) => {

    try {
        const accessToken = jwt.sign({id:user._id}, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: '14m' })

        const refreshToken = jwt.sign({id:user._id}, process.env.REFRESH_TOKEN_PRIVATE_KEY, { expiresIn: '30d' })

        const userToken = await UserToken.findOne({ userId: user._id })

        if (userToken) await UserToken.findByIdAndDelete(userToken._id.toString())
        

        await new UserToken({ userId: user._id, token: refreshToken }).save()

        return Promise.resolve({ accessToken, refreshToken })
    } catch (error) {
        return Promise.reject(error)
    }


}

export default generateTokens