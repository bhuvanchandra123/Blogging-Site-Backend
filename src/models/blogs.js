const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId; //import object id

const blogSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  userId: { type: ObjectId, ref: 'User', required: true },
  tags: { type: [String] },
  category: { type: String, required: true, enum: ['technology', 'entertainment', 'lifestyle', 'food', 'fashion'] },
  subcategory: { type: [String] }, //examples - [web development, AI, ML]
  deletedAt: { type: Date },
  isDeleted: { type: Boolean, default: false },
  publishedAt: { type: Date },
  isPublished: { type: Boolean, default: false },
  likeCount: { type: Number, default: 0 }
 },
 { timestamps: true }
);
  
  const Blogs = mongoose.model('Blog', blogSchema);
  
  module.exports = Blogs;