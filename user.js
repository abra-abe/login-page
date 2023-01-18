require('dotenv').config()
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// connecting to database
let uri = process.env.MONGO_URI
uri = uri.replace('<password>', process.env.MONGO_PASS)

mongoose.connect(uri)

//creating model
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

//setting up passport plugin
userSchema.plugin(passportLocalMongoose);

//exporting the model
const User = mongoose.model('User', userSchema);

module.exports = User