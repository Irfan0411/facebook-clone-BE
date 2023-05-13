const router = require("express").Router()
const Post = require("../models/Post")
const User = require("../models/User")

// NEW POST
router.post("/", async (req, res)=>{
    try {
        const newPost = await Post.create(req.body)
        res.status(200).json(newPost)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

// DELETE POST
router.delete("/:id", async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id)
        console.log(post);
        if (post.userId === req.body.userId) {
            await post.deleteOne()
            res.status(200).json("the post has been deldete")
        } else {
            res.status(403).json("you can delete only your post")
        }
    } catch (err) {
        res.status(500).json(err)
        console.log(err)
    }
})

// UPDATE POST
router.put("/:id", async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.updateOne({$set: req.body})
            res.status(200).json("your post has been updated")
        } else {
            res.status(403).json("you can update only your post")
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

// GET A POST
router.get("/:id", async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
})

// GET USER'S ALL POST
router.get("/profile/:username", async (req, res)=>{
    try {
        const user = await User.findOne({username: req.params.username})
        const posts = await Post.find({userId: user._id})
        !posts && res.status(403).json("tidak ada postingan")
        res.status(200).json(posts)
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
})

// GET TIMELINE POST
router.get("/timeline/:id", async (req, res)=>{
    try {
        const currentUser = await User.findById(req.params.id)
        const userPost = await Post.find({userId: req.params.id})
        if(currentUser.friends.length === 0) res.status(200).json(userPost)
        const friendPost = await Promise.all(
            currentUser.friends.map((friendId)=>{
                return Post.find({userId: friendId})
            })
        )
        res.status(200).json(userPost.concat(...friendPost))
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})
module.exports = router