const bcrypt = require("bcrypt")
const Blog = require("../models/blogs");

const createBlog = async (req, res) => {
    try {
        const { title, body, tags, category, subcategory, isPublished } = req.body;
        const blog = new Blog({
          title,
          body,
          userId: req.user.userId,
          tags,
          category,
          subcategory,
          isPublished
        });
        await blog.save();
        res.status(201).json({status: true, msg: "blog created successfully", data: blog });
    } catch (err) {
      console.log(err)
      res.status(400).json({message: "server error"});
    }
}


const getBlogs = async (req, res) => {
    try {
      const {userId, category, tags, subcategory, page = 1} = req.query;
      const filterOption = {
        isDeleted:false, 
        isPublished:true
      }
      if(userId){
        filterOption.userId = userId
      }
      if(category){
        filterOption.category = category
      }
      if(tags){
        filterOption.tags = {$all: tags.split(',')}
      }
      if(subcategory){
        filterOption.subcategory = subcategory
      }    
      console.log(filterOption)
 
      const limit = 5;
      const skip = (parseInt(page) - 1 * limit)
      const result = await Blog.find(filterOption)
      .skip(skip)
      .limit(limit)
    
      return res.status(200).send({status: true, data: result})// ToDo => add pagination
    } catch (err) {
      res.status(400).json({message: "server error"});
    }
      //$or $in $nin $nor $and
}


const updateBlogs = async (req, res) => {
    try {
        const updateData = req.body;
        const blog = await Blog.findOneAndUpdate({ _id: req.params.blogId, userId: req.user.userId },updateData, {new: true} ); 

    if (!blog) {
      return res.status(404).json({status: false, msg: 'Blog not found' });
    }
    // Object.assign(blog, req.body);
    // await blog.save();
    res.status(201).json({status: true, msg: 'Blog updated successfully', data: blog });
    } catch (err) {
      res.status(400).json({message: "server error"});
    }
}


const softDeleteBlogs = async (req, res) => {
    try {
        const blog = await Blog.findOneAndUpdate({ _id: req.params.blogId, userId: req.user.userId }, {isDeleted: true, deletedAt: new Date()},
        {new: true});
        // console.log(blog)
    if (!blog) {
      return res.status(404).json({ status: false, msg: 'Blog not found' });
    }
    // blog.isDeleted = true;
    // blog.deletedAt = new Date();
    // await blog.save();
    res.status(200).json({ status: true, msg: 'Blog deleted successfully'});
    } catch (err) {
      console.log(err)
      res.status(500).json({message: "server error"});
    }
}


const deleteBlogs = async (req, res) => {
    try {
      const filterOption = {}
      const {userId, category, tags, isPublished} = req.query;
       if(userId){
         filterOption.userId = userId
       }
       if(category){
        filterOption.category = category
      }
      if(tags){
        filterOption.tags = {$all: tags.split(",")}
      }
      console.log(filterOption)
      // if(!isPublished){
      //   filterOption.isPublished = isPublished
      // }
      const result = await Blog.deleteMany(filterOption)
      console.log(result)
       if(result === 0){
         return res.status(400).send({status: false, msg: "blog not found"})
       }
       return res.status(200).send({status: true, msg: "deleted successfully"})
    } catch (err) {
      res.status(400).json({message: "server error"});
    }
}


module.exports = {createBlog, getBlogs, updateBlogs, softDeleteBlogs, deleteBlogs};

