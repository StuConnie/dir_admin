const jwt = require("jsonwebtoken")
const Users = require("../models/users.js")
const express = require("express")
const router = express.Router()
const asyncHandler = require("../helper/asyncHandler.js")

const genToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "3h"
    })
}

router.get("/data", asyncHandler(async (req, res) => {
    const users = await Users.find({}).select('-password')
    res.status(200).json(users)

}))

router.post("/login", asyncHandler(async (req, res) => {
    const {email} = req.body
    const user = await Users.findOne({email})

    if (user) {
        const token = genToken(user.id)
        res.status(200).json({
            isTeacher: user.isTeacher,
            isStudent: user.isStudent,
            isAdmin: user.isAdmin,
            token,
            message: "Successfully logged in"
        })
    } else {
        res.status("404")
        throw new Error("Invalid email or password")
    }
}))


router.post("/register", asyncHandler(async (req, res) => {
    const {username, email, access, track, password} = req.body

    const existingUser = await Users.findOne({email})

    if (existingUser) {
        res.status(400)
        throw new Error("User already exist")
    }

    try {
        const newUser = new Users({
            username,
            email,
            isStudent: access.toLowerCase() === "student",
            isTeacher: access.toLowerCase() === "teacher",
            track,
            password
        })

        const token = genToken(newUser.id)

        const registeredUser = await newUser.save()

        res.status(200).json({
            registeredUser,
            token,
            message: "User have been registered!"
        })

    } catch (e) {
        res.status("404")
        throw new Error("Invalid resource")
    }
}))

module.exports = router