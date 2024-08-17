import { Router } from "express";
import {createReview, deleteReview, getCurrentUser, getMovieWithDetails, getMovieWithReviews, registerUser, updateReview} from '../contollers/users.controller.js'
import { loginUser } from "../contollers/users.controller.js";
import authenticateToken from "../middlewares/verifyJWT.js";

const router = Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/currentuser").get(getCurrentUser)
router.route("/deletereview").post(authenticateToken,deleteReview)
router.route("/updatereview").post(authenticateToken,updateReview)
router.route("/getmoviewithreviews/:id").get(getMovieWithReviews)
router.route("/createreview").post(createReview)
router.route("/movies").get(getMovieWithDetails)






export default router 