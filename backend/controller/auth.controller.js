import { User } from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import crypto from "crypto"

import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js"
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js"
import verifyToken from "../middleware/verifyToken.js"

export const signup = async (req, res) => {
  const { name, email, password } = req.body
  const SALT = process.env.SALT
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please fill all the fields" })
    }
    const userInDB = await User.findOne({ email })
    if (userInDB) {
      return res.status(400).json({ error: "User already exists" })
    }
    const hashedPassword = await bcryptjs.hash(password, 10)
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString()
    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    })
    await user.save() // may ask to make it user.save()
    generateTokenAndSetCookie(res, user._id)
    await sendVerificationEmail(user.email, verificationToken)
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { ...user._doc, password: undefined },
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const verifyEmail = async (req, res) => {
  const { code } = req.body
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    })
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Invalid Or Expired Verification Code",
      })
    user.isVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpiresAt = undefined
    await user.save()
    await sendWelcomeEmail(user.email, user.name)
    res.status(200).json({
      success: true,
      message: "Email Verified Successfuly!",
      user: {
        ...user._doc,
        password: undefined,
      }, //now on 1:16:57 and 1:08:37
    })
  } catch (error) {
    console.log("error in verifyEmail", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const signin = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" })
    }
    const isPasswordMarch = await bcryptjs.compare(password, user.password)
    if (!isPasswordMarch) {
      return res.status(400).json({ error: "Invalid credentials" })
    }
    generateTokenAndSetCookie(res, user._id)
    res.status(200).json({
      success: true,
      message: "Signin successful",
    })
    user.lastLogin = new Date()
    await user.save()
    res.status(200).json({
      success: true,
      message: "Signin successful",
      user: { ...user._doc, password: undefined },
    })
  } catch (error) {
    console.log("error in signin", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
export const signout = async (req, res) => {
  res.clearCookie("token")
  res.status(200).json({ message: "Signout successfully" })
}

export const forgetPassword = async (req, res) => {
  const { email } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: "User not found" })
    }
    const resetToken = crypto.randomBytes(20).toString("hex")
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000 // 1 hour

    user.resetPasswordToken = resetToken
    user.resetPasswordExpiresAt = resetTokenExpiresAt
    await user.save()
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    )
    res.status(200).json({ message: "Reset password link sent to your email" })
  } catch (error) {
    console.log("error in forgetPassword", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
export const resetPassword = async (req, res) => {
  const { token } = req.params
  const { password } = req.body
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    })
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Or Expired Token" })
    }
    const hashedPassword = await bcryptjs.hash(password, 10)
    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpiresAt = undefined
    await user.save()

    await sendResetSuccessEmail(user.email)
    res
      .status(200)
      .json({ success: true, message: "Password Reset Successful!" })
  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, message: error.message })
  }
}

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password")
    if (!user) {
      return res.status(400).json({ message: "User Not Found" })
    }
    res.status(200).json({ message: true, user })
  } catch (error) {

  }
}
