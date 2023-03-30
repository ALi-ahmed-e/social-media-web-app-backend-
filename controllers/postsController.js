import Post from "../models/Post.js"
import userSchema from '../models/User.js'
import cloudinary from '../utils/cloudinary.js'







const AddPost = async (req, res) => {
    const { image, title } = req.body



    try {

       


        if (image) {
            const result = await cloudinary.uploader.upload(image, {
                folder: "posts/images",

            })

            const newpost = await Post.create({
                image: result.secure_url,
                title,
                userId: req.user.id
            })

            res.status(200).json(newpost)
        } else {

            const newpost = await Post.create({ ...req.body, userId: req.user.id })

            res.status(200).json(newpost)
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({ "message": error.message })
    }

}

const updatePost = async (req, res) => {
    const id = req.params.id
    try {
        const post = await Post.findById(id)
        if (req.user && post.userId && req.user.id.toString() == post.userId.toString()) {
            const newpost = await Post.findByIdAndUpdate(id, req.body)

            const updatedPost = await Post.findById(newpost._id)

            res.status(200).json(updatedPost)
        } else {
            res.status(400).json({ "message": "you can't update others posts " })
        }
    } catch (error) {
        res.status(400).json({ "message": error.message })
        res.status(400).json({ "message": "error occurd" })
    }
}

const deletePost = async (req, res) => {
    const id = req.params.id
    try {
        const post = await Post.findById(id)
        if (req.user && post.userId && req.user.id.toString() == post.userId.toString()) {
            await Post.findByIdAndDelete(id)

            res.status(200).json({ "message": "post deleted" })
        } else {
            res.status(400).json({ "message": "you can't delete others posts " })
        }

    } catch (error) {
        res.status(400).json({ "message": "error occurd" })
    }
}

const commentPost = async (req, res) => {
    const id = req.params.id
    try {
        const post = await Post.findById(id)

        const comment = {
            user: req.user.id,
            comment: req.body.comment,
        }

        post.comments.push(comment)

        post.save()

        res.status(200).json({ "message": post })


    } catch (error) {
        res.status(400).json({ "message": error.message })
    }
}

const deletecommentPost = async (req, res) => {
    const id = req.params.id
    const commentid = req.params.cmtid

    try {
        const post = await Post.findById(id)

        post.comments.splice(post.comments.findIndex(cmnt => cmnt._id == commentid), 1)
        post.save()
        res.status(200).json({ "message": post })


    } catch (error) {
        res.status(400).json({ "message": error.message })
    }
}

const togglelikeePost = async (req, res) => {
    const id = req.params.id
    try {
        const post = await Post.findById(id)

        if (!post.likes.includes(req.user.id.toString())) {
            await post.updateOne({ $push: { likes: req.user.id.toString() } })

            res.status(200).json({ "message": "post liked" })
        } else {
            await post.updateOne({ $pull: { likes: req.user.id.toString() } })

            res.status(200).json({ "message": "removed  like from post" })
        }

    } catch (error) {
        res.status(400).json({ "message": error.message })
        res.status(400).json({ "message": "error occurd" })
    }
}

const getPost = async (req, res) => {
    const _id = req.params.id
    try {
        const post = await Post.findById({ _id })
        res.status(200).json({ post })
    } catch (error) {
        res.status(400).json({ "message": error.message })
        res.status(400).json({ "message": "error occurd" })
    }
}

const getSomeonePosts = async (req, res) => {
    const { page, limit } = req.query
    const skip = (page - 1) * limit
    
    const userId = req.params.id
    try {
        const resp = await Post.find({ userId }).skip(skip).limit(limit)
        
        const number_of_docs = await Post.find({ userId }).countDocuments()

        const posts = resp
        

        res.status(200).json({ posts, number_of_docs, page})
    } catch (error) {
        res.status(400).json({ "message": error.message })
    }
}



const gettimelinePost = async (req, res) => {
    try {
        const { page, limit } = req.query

        const skip = (page - 1) * limit

        const crrentUser = await userSchema.findById(req.user.id.toString())


        const uidadnFollowings = crrentUser.following.concat([req.user.id.toString()])


        const allPosts = await Post.find({ userId: { $in: uidadnFollowings } }).skip(skip).limit(limit)


        const number_of_docs = await Post.find({ userId: { $in: uidadnFollowings } }).countDocuments()




        res.status(200).json({ posts: allPosts, number_of_docs, page: req.query.page })


    } catch (error) {
        res.status(400).json({ "message": error.message })
        res.status(400).json({ "message": "error occurd" })
    }
}

const getexplorePosts = async (req, res) => {
    const { page, limit } = req.query
    const skip = (page - 1) * limit
    
    try {
        const resp = await Post.find().skip(skip).limit(limit)
        
        const number_of_docs = await Post.find().countDocuments()

        const posts = resp
        

        res.status(200).json({ posts, number_of_docs, page})
    } catch (error) {
        res.status(400).json({ "message": error.message })
    }
}





export { AddPost, updatePost,getexplorePosts, getSomeonePosts, deletePost, togglelikeePost, getPost, gettimelinePost, commentPost, deletecommentPost, }