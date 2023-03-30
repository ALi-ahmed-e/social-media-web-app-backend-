import jwt from 'jsonwebtoken'

const authMiddleware = async (req, res, next) => {
   
    try {
        const token = req.cookies.access_token;
        if (!token) {
    
            return res.status(401).json({ message: "No token, authorization denied" })
        }

        const tokenDetails = jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY)
        req.user = tokenDetails
        next()
    } catch (error) {
        res.status(500).json({ message: "authorization denied invalid toke n" })
    }

}

export default authMiddleware