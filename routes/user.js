import { updateUser, deleteUser, getUser, togglefollowUser, searcUsers, getsugestedUsers } from "../controllers/userController.js"
import { Router } from 'express'
const router = Router()




//update user
router.put("/update-user", updateUser)

//delete user
router.delete("/delete-user", deleteUser)

//get user
router.get("/get-user/:id", getUser)

//follow and unfollow user
router.post("/follow-user/:id", togglefollowUser)

//search users
router.get("/search-users", searcUsers)

//get suggested users
router.get("/get-sug-users", getsugestedUsers)



export default  router