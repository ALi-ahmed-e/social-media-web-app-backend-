import User from '../models/User.js'
import cloudinary from '../utils/cloudinary.js'
import postSchema from '../models/Post.js'








const updateUser = async (req, res) => {
    const id = req.user.id.toString()


    try {
        if (id) {
            if (req.body.profileImage) {



                const result = await cloudinary.uploader.upload(req.body.profileImage, {
                    folder: "users/images",
                    width: 130,
                    height: 130,
                    crop: 'scale'
                })


                const { profileImage, ...rest } = req.body

                await User.findByIdAndUpdate(id, { ...rest, profileImage: result.secure_url })

            } else {
                await User.findByIdAndUpdate(id, req.body)
            }



            const updatedUser = await User.findById(id)
            const { password, ...other } = updatedUser._doc

            res.status(200).json(other)
        } else {
            res.status(400).json({ "message": "user id needed" })
        }
    } catch (error) {
        res.status(400).json({ "message": error.message })
        res.status(400).json({ "message": "error occurd" })
    }
}


const deleteUser = async (req, res) => {
    const id = req.user.id.toString();

    try {
        await User.findByIdAndDelete(id)
        await postSchema.deleteMany({ user: id })
        res.status(200).json({ "message": "account successfuly deleted" })

    } catch (error) {
        res.status(400).json({ "message": "error occurd" })
    }
}


const getUser = async (req, res) => {
    const id = req.params.id

    try {
        const user = await User.findById(id)
        const { password, updatedAt, ...other } = user._doc
        res.status(200).json({ ...other })

    } catch (error) {
        res.status(400).json({ "message": "error occurd" })
    }
}


const togglefollowUser = async (req, res) => {
    const id = req.params.id


    try {

        if (id !== req.user.id.toString()) {

            const user = await User.findById(id)

            const currentuser = await User.findById(req.user.id.toString())

            if (!user.followers.includes(req.user.id.toString())) {

                await user.updateOne({ $push: { followers: req.user.id.toString() } })

                await currentuser.updateOne({ $push: { following: id } })

                res.status(200).json({ "message": "user followed" })

            } else {
                await user.updateOne({ $pull: { followers: req.user.id.toString() } })
                await currentuser.updateOne({ $pull: { following: id } })

                res.status(200).json({ "message": "user unfollowed" })
            }
        } else {
            res.status(403).json({ "message": "you cant follow yourself" })
        }


    } catch (error) {
        res.status(400).json({ "message": "error occurd" })
    }
}


const searcUsers = async (req, res) => {
    const query = req.params.q

    try {
        if (query) {
            const users = await User.aggregate([
                {
                    $search: {
                        index: "default",
                        text: {
                            query: query,
                            path: {
                                wildcard: "*"
                            }
                        }
                    }
                }
            ])

            res.status(200).json({ users })

        } else {
            res.status(400).json({ "message": "you have to add search query" })
        }

    } catch (error) {
        res.status(400).json({ "message": "error occurd" })
    }


}

const getsugestedUsers = async (req, res) => {
    const id = req.user.id
    try {
        const users = await User.find({_id: { $ne: id }}).limit(10)

        res.status(200).json({ users })
    } catch (err) {
        res.status(400).json({ "message": err })
        res.status(400).json({ "message": "error occurd" })
    }

}


export  { updateUser, deleteUser, getUser, togglefollowUser, searcUsers, getsugestedUsers }