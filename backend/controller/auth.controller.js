import { User } from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js"
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
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { ...user._doc, password: undefined },
    })
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
}
export const signin = async (req, res) => {
  res.send("Signin")
}
export const signout = async (req, res) => {
  res.send("Signout")
}
//i have to make the signup and signin and signout functions
