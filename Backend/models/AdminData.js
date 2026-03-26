const mongoose =require('mongoose');
const AdminSchema = new mongoose.Schema({
    name: String,
    email : String,
    password : String,
    phone : Number,
    image : String,
})

module.exports = mongoose.model("AdminData",AdminSchema)