import express from "express"
import {
  signin,
  signout,
  signup,
  verifyEmail,
  forgetPassword,
  resetPassword,
} from "../controller/auth.controller.js"
const router = express.Router()

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/signout", signout)
router.post("/verify-email", verifyEmail)
router.post("/forgot-password", forgetPassword)
router.post("/reset-password/:token", resetPassword)

export default router
