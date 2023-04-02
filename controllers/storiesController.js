import Storie from "../models/Storie.js";
import User from "../models/User.js";
import cloudinary from '../utils/cloudinary.js'




const createStorie = async (req, res) => {
    const { image, video } = req.body

    try {

        if (image || video) {
            if (image) {
                const result = await cloudinary.v2.uploader.upload(image, { resource_type: 'image', folder: "stories/" + 'image' })

                const newstorie = await Storie.create({
                    image: result.secure_url,
                    userId: req.user.id
                })

                res.status(200).json(newstorie)

            } else {
                const result = await cloudinary.v2.uploader.upload(video, { resource_type: 'video', folder: "stories/videos", })





                const newstorie = await Storie.create({
                    video: result.secure_url,
                    userId: req.user.id
                })

                res.status(200).json(newstorie)
            }

        }
        

    } catch (error) {
        console.log(error)
        res.status(400).json({ "message": error.message })
    }

}



const getStories = async (req, res) => {
    

    try {

        const crrentUser = await User.findById(req.user.id.toString())


        const uidadnFollowings = crrentUser.following.concat([req.user.id.toString()])


        const stories = await Storie.find({ userId: { $in: uidadnFollowings } })

        res.status(200).json({ stories })


    } catch (error) {
        console.log(error)
        res.status(400).json({ "message": error.message })
    }

}

















export {
    createStorie,
    getStories,

}