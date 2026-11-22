const express = require("express");
const cookieParser = require("cookie-parser")
const cors = require("cors")


const app = express()

app.set("trust proxy", 1)

app.use(express.json())
app.use(cookieParser())

const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== "production") {
            return callback(null, true);
        }
        return callback(null, true); // Alternatively allow all in case dynamic preview URLs exist
    },
    credentials: true
}))

// require all the routes here
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")
//using all the routes here 
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)


module.exports = app