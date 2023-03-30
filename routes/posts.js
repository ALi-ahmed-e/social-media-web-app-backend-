import { Router } from "express";
import { AddPost, updatePost, deletePost, togglelikeePost, getPost, gettimelinePost, commentPost, deletecommentPost, getSomeonePosts, getexplorePosts } from "../controllers/postsController.js";
const router = Router()

//add post
router.post("/add-post", AddPost)

//update post
router.put("/update-post/:id", updatePost)

//delete post
router.delete("/delete-post/:id", deletePost)

//like post
router.put("/like-post/:id",  togglelikeePost)

//comment post
router.put("/comment-post/:id", commentPost)

//delete comment 
router.put("/delete-comment-post/:id/:cmtid", deletecommentPost)

//get post
router.get("/get-post/:id", getPost)

//get someone posts
router.get("/get-someone-posts/:id", getSomeonePosts)

//get explore  posts page
router.get("/get-explore-posts", getexplorePosts)

//get timeline
router.get("/get-timeline-post", gettimelinePost)



export default router;