const mongoose = require('mongoose')

const WishlistSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "UserData",
        required : true
    }, 
    packageId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "PackageData",
        required : true
    }, 
    createdAt : {
        type : Date, 
        default : Date.now
    }
})

module.exports = mongoose.model("WishlistData",WishlistSchema)