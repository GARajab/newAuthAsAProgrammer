import jwt from "jsonwebtoken"

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  })
  res.cookie("token", token, {
    expires: new Date(Date.now() + 86400000),
    httpOnly: true,
    secre: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  return token
}

export default generateTokenAndSetCookie
