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
import applicationRouter from "./routes/application.routes.js"
// routes declaration 

app.use("/v1/student",studentRouter)
app.use("/v1/admin",adminRouter)
app.use("/v1/application",applicationRouter)
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err); // Optional: for debugging
  
    const statusCode = err.statuscode || 500;
  
    return res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
      errors: err.errors || [],
      data: err.data || null,
    });
  });
export { app }