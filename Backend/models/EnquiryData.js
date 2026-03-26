const mongoose = require('mongoose')

const EnquirySchema = mongoose.Schema({
    name : String,
    email : String,
    phone : Number,
    subject : String,
    msg : String,
})

module.exports = mongoose.model("EnquiryData",EnquirySchema)