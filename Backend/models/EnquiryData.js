const mongoose = require('mongoose')

const EnquirySchema = mongoose.Schema({
    name : String,
    email : String,
    phone : Number,
    subject : String,
    msg : String,
    status: {
        type: String,
        default: "new"
    }
})

module.exports = mongoose.model("EnquiryData",EnquirySchema)