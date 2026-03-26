// const mongoose = require('mongoose');

// const BookingSchema = mongoose.Schema({
//     bookingId : String,
//     // travelerName : String, 
//     userEmail : String,
//     packageName : String,
//     location : String,
//     image : String,
//     travelers : Array,
//     departureDate : Date,
//     price : Number,
//     totalPrice : Number,
//     paymentId : String,
//     status : {
//         type : String,
//         default:"Pending"
//     },
//     bookingDate : {
//         type : Date,
//         default :Date.now
//     },

// })
// module.exports = mongoose.model("BookingData",BookingSchema)


const mongoose = require('mongoose');
 
const BookingSchema = mongoose.Schema({
  bookingId:       String,
  userEmail:       String,
  packageId:       { type: mongoose.Schema.Types.ObjectId, ref: 'PackageData' },
  packageName:     String,
  location:        String,
  image:           String,
  travelers:       Array,
  departureId:     String,          // _id of the chosen departure slot
  departureDate:   Date,            // startDate of the chosen slot
  endDate:         Date,            // endDate of the chosen slot
  price:           Number,          // per-person price
  totalPrice:      Number,
  paymentMethod:   String,
  specialRequests: String,
  paymentId:       String,
  status: {
    type:    String,
    default: 'Pending',
  },
  bookingDate: {
    type:    Date,
    default: Date.now,
  },
});
 
module.exports = mongoose.model('BookingData', BookingSchema);
