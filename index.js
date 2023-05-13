const express = require("express")
const app = express()
const mongoose = require("mongoose")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")
const userRoute = require("./routes/users")
const cors = require("cors")
const path = require("path")
const helmet = require("helmet")
const morgan = require("morgan")
const dotenv = require("dotenv")

dotenv.config()

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("databse connected"))
.catch(()=>console.log("database connection failed"))

app.use("/images", express.static(path.join(__dirname, "public/images")))

// middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
app.use(cors())

app.use("/api/auth", authRoute)
app.use("/api/post", postRoute)
app.use("/api/user", userRoute)

app.listen(8800, ()=>console.log("server is running at port 8800"))