const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    required: true
  },
  number: {
    type: String,
    minLength: [8, 'Number should have a length of 8 or more'],
    validate: {
      validator: (number) => {
        return /^(?=.{8,}$)\d{2,3}-\d+$/.test(number)
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    }
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = document._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

