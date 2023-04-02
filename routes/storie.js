import { Router } from "express";
import { createStorie, getStories } from "../controllers/storiesController.js";


const router = Router()





router.post("/add-storie", createStorie)

router.get("/get-stories", getStories)


export default router;