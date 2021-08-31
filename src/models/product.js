const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
 
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('etsy', productSchema)