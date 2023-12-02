const mongoose= require("mongoose")

 const userSchema =  new mongoose.Schema ({
    username: {type: String , required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String , required: true},
    track: {type: String , required: true},
    isAdmin: {type: Boolean, required: true, default: false},
    isStudent: {type: Boolean, required: true, default: false},
    isTeacher: {type: Boolean, required: true, default: false},
});

const Users = mongoose.model("User", userSchema)

module.exports =  Users