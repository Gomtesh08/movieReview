import { Router } from "express";
import {createReview, deleteReview, getCurrentUser, getMovieWithDetails, getMovieWithReviews, logoutUser, registerUser, updateReview} from '../contollers/users.controller.js'
import { loginUser } from "../contollers/users.controller.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const router = Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/currentuser").get(getCurrentUser)
router.route("/deletereview/:id").delete(deleteReview)
router.route("/updatereview/:id").put(updateReview)
router.route("/getmoviewithreviews/:id").get(getMovieWithReviews)
router.route("/createreview/:movieId/:userId").put(createReview)
router.route("/movies").get(getMovieWithDetails)
router.route("/logout").post(logoutUser)






export default router 