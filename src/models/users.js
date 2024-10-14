const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fName: { type: String, required: true },
  lName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 8 },
}, { timestamps: true });

const Users = mongoose.model('Users', userSchema);

module.exports = Users;