const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require("validator")


const userSchema = new Schema({
  fName: { type: String, required: true },
  lName: { type: String, required: true },
  email: { type: String, required: true, unique: true,
    validate: {
    validator: validator.isEmail,
    message: props => `${props.value} is not a valid email address!`
  } },
  password: { type: String, required: true, minLength: 8 },
}, { timestamps: true });

const Users = mongoose.model('Users', userSchema);

module.exports = Users;