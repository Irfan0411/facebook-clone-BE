const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")

// GET A USER
router.get("/:username", async (req, res)=>{
    try {
        const user = await User.findOne({username: req.params.username})
        const { password, updateAt, friendSendReq, friendReceiveReq, ...other} = user._doc
        res.status(200).json(other)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

// UPDATE USER
router.put("/:id", async (req, res)=>{
    if(req.params.id === req.body.userId) {
        if(req.body.password) {
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }
        try {
            await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            })
            res.status(200).json("account has been updated")
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("you can update only your account")
    }
})

// SEND FRIEND REQUEST AND CANCLE IT
router.post("/request/:id", async (req, res)=>{
    if (req.params.id !== req.body.userId) {
        const user = await User.findById(req.params.id)
        const currentUser = await User.findById(req.body.userId)
        if (!currentUser.friends.includes(req.params.id)) {
            try {
                if(!currentUser.friendSendReq.includes(req.params.id)) {
                    await user.updateOne({$push: {friendReceiveReq: req.body.userId}})
                    await currentUser.updateOne({$push: {friendSendReq: req.params.id}})
                    res.status(200).json("success send request")
                } else {
                    await user.updateOne({$pull: {friendReceiveReq: req.body.userId}})
                    await currentUser.updateOne({$pull: {friendSendReq: req.params.id}})
                    res.status(200).json("success cancle send request")
                }         
            } catch (err) {
                console.log(err)
                res.status(500).json(err)
            }
        } else {
            res.status(403).json("you allready friend this user")
        }
    } else {
        res.status(403).json("you can't request your self")
    }
})

// GET LIST FRIEND REQUEST
router.get("/request/:id", async (req, res)=>{
    try {
        const user = await User.findById(req.params.id)
        !user && res.status(403).json("nothing")
        const { friendReceiveReq, ...other} = user._doc
        res.status(200).json(friendReceiveReq)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

// CONFIRM FRIEND REQUEST
router.post("/confirm/:id", async (req, res)=>{
    try {
        const user = await User.findById(req.params.id)
        const currentUser = await User.findById(req.body.userId)

        await user.updateOne({
            $pull: { friendSendReq: req.body.userId },
            $push: { friends: req.body.userId}
        })
        await currentUser.updateOne({
            $pull: { friendReceiveReq: req.params.id },
            $push: { friends: req.params.id }
        })

        res.status(200).json("confirm success")
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

// REJECT FRIEND REQUEST
router.post("/reject/:id", async (req, res)=>{
    try {
        const user = await User.findById(req.params.id)
        const currentUser = await User.findById(req.body.userId)
        
        await user.updateOne({
            $pull: { friendSendReq: req.body.userId }
        })
        await currentUser.updateOne({
            $pull: { friendReceiveReq: req.params.id }
        })
        
        res.status(200).json("reject success")
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

// GET LIST FRIEND
router.get("/friends/:id", async (req, res)=>{
    try {
        const friends = await User.findById(req.params.id)
        res.status(200).json(friends.friends)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

module.exports = router