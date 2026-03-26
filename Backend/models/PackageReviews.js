const mongoose = require('mongoose');
const PackageReviewSchema = mongoose.Schema({
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: "PackageData" },
  userId: String,
  rating: Number,
  review: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("PackageReview", PackageReviewSchema);