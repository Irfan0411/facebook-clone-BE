const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")

router.get("/", (req, res)=>res.json("hello wordl"))
// REGISTER
router.post("/register", async (req, res)=>{
    try {
        //generate new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        //create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        const user = await newUser.save()
        const { password, ...other } = user._doc
        res.status(200).json(other)
    } catch (err) {
        res.status(500).json(err)
        console.log(err);
    }
})

//LOGIN
router.post("/login", async (req, res)=>{
    try {
        const user = await User.findOne({ email: req.body.email })
        !user && res.status(404).json("user not found")

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("wrong password")

        const { password, ...other } = user._doc
        console.log(other)
        res.status(200).json(other)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

module.exports = router