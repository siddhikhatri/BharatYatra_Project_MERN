// const mongoose = require('mongoose')

// const PackageSchema = mongoose.Schema({
//   name: String,
//   location: String,
//   image : String,
//   images: [String],
//   days: Number,
//   nights: Number,
//   rating: Number,
//   reviews: Number,
//   tags: [String],
//   originalPrice: Number,
//   price: Number,
//   discount: Number,
//   themes: [String],
//   //season: [String],
//   destination: String,
  
//   description : String,
//   highlights : [String],
//   bestSeason : [String],
  

//   itinerary: [
//     {
//       day: Number,
//       title: String,
//       subtitle: String,
//       activities: [String],
//     }
//   ],

//   included: [String],
//   excluded: [String],


// })

// module.exports = mongoose.model("PackageData",PackageSchema)


const mongoose = require('mongoose')

const DepartureSchema = new mongoose.Schema({
  startDate:   { type: Date,   required: true },
  endDate:     { type: Date,   required: true },
  totalSeats:  { type: Number, required: true },
  bookedCount: { type: Number, default: 0 },   // auto-incremented when user books
  isActive:    { type: Boolean, default: true },
})

const PackageSchema = mongoose.Schema({
  name: String,
  location: String,
  image: String,
  images: [String],
  days: Number,
  nights: Number,
  rating: Number,
  reviews: Number,
  tags: [String],
  originalPrice: Number,
  price: Number,
  discount: Number,
  themes: [String],
  destination: String,
  description: String,
  highlights: [String],
  bestSeason: [String],

  itinerary: [
    {
      day: Number,
      title: String,
      subtitle: String,
      activities: [String],
    }
  ],

  included: [String],
  excluded: [String],

  // Fixed departure slots added 
  departures: [DepartureSchema],
})

module.exports = mongoose.model("PackageData", PackageSchema)