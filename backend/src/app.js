import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.set('trust proxy', 1)

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true, limit: '16kb'}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import 

import studentRouter from "./routes/student.routes.js"
import adminRouter from "./routes/admin.routes.js"
// routes declaration 

app.use("/v1/student",studentRouter)
app.use("/v1/admin",adminRouter)

export { app }