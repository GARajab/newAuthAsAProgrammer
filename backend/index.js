import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./db/connectDB.js"
import authRouters from "./routes/auth.route.js"

const app = express()
dotenv.config()
const PORT = process.env.PORT || 5000

app.use(express.json())

app.use("/auth", authRouters)

app.listen(PORT, () => {
  connectDB()
  console.log("Server is running on http://localhost:" + PORT)
})
