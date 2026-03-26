const mongoose = require('mongoose')
const PackageEnquirySchema = mongoose.Schema({
        name : String,
        phone : Number,
        email : String,
        packageName : String,
        travelDate : Date,
        adults : Number,
        children : Number,
        message : String,
    }
)
module.exports = mongoose.model("PackageEnquiry",PackageEnquirySchema)