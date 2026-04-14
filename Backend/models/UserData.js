const mongoose =require('mongoose')
const userSchema = mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    password: String,
    dob: String,
    address: String,
    city: String,
    country: String,
    avatar: String
})
module.exports = mongoose.model("UserData",userSchema)