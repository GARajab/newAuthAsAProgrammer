import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ message: "unauthorized - no token provided" })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    if (!decoded) return res.status(401).json({ message: "unauthorized - no token provided" })
    next()
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Server Error" })
  }
}

export default verifyToken