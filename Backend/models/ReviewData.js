const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PackageData"
  },
  userName: String,
  userEmail: String,
  rating: Number,
  review: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ReviewData", ReviewSchema);