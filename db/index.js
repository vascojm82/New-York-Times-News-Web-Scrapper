const config = require('../config');
const Mongoose = require('mongoose');

Mongoose.connect(config.dbURI);
Mongoose.connection.once('open',()=>{
    console.log('Connected to db');
});

//Create a Schema that defines the structure for storing user data
const user = new Mongoose.Schema({
  profileId: String,
  fullName: String,
  profilePic: String
});

//Turn the schema into a usable model
let userModel = Mongoose.model('user', user);

module.exports = {
  Mongoose,
  userModel
}
