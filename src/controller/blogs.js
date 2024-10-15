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
      // console.log(filterOption)
 
      const limit = 2;
      const skip = (parseInt(page) - 1) * limit;
      const result = await Blog.find(filterOption)
      .skip(skip)
      .limit(limit)
      // console.log('Query result:',result)
    
      return res.status(200).send({status: true, data: result})
    } catch (err) {
      console.log(err)
      res.status(400).json({message: "server error"});
    }
}


const updateBlogs = async (req, res) => {
    try {
        const updateData = req.body;
        const blog = await Blog.findOneAndUpdate({ _id: req.params.blogId, userId: req.user.userId },updateData, {new: true} ); 

    if (!blog) {
      return res.status(404).json({status: false, msg: 'Blog not found' });
    }

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

    res.status(200).json({ status: true, msg: 'Blog deleted successfully'});
    } catch (err) {
      console.log(err)
      res.status(500).json({message: "server error"});
    }
}


const deleteBlogs = async (req, res) => {
    try {
      const filterOption = {}
      const {userId} = req.params;
      const {category, tags, isPublished} = req.query;
      
      if (!userId) {
        return res.status(400).send({ status: false, msg: "userId is required" });
      }
      if (!category && !tags && isPublished === undefined) {
        return res.status(400).send({ status: false, msg: "At least one query parameter (category, tags, or isPublished) is required" });
    }
         filterOption.userId = userId;

       if(userId){
         filterOption.userId = userId
       }
       if(category){
        filterOption.category = category
       }
       if(tags){
        filterOption.tags = {$all: tags.split(",").map(tag => tag.trim()) }
       } 
       if(isPublished !== undefined){
        if(isPublished === "false"){
          filterOption.isPublished = false;
        }else if(isPublished === "true"){
          filterOption.isPublished = true;
        }else{
        return res.status(400).send({status: false, msg: "isPublished accecpt only boolean value e.i. true or false"})
        }
       }
      
      if(!filterOption){
        return res.status(400).send({status: false, msg: "query field is missing"})
      }
      const result = await Blog.deleteMany(filterOption)
       if(result.deletedCount === 0){
         return res.status(400).send({status: false, msg: "No blogs found matching the criteria"})
       }
       return res.status(200).send({status: true, msg: "deleted successfully"})
    } catch (err) {
      res.status(500).json({message: "server error", error: err.message});
    }
}


const updateLikeCount = async (req, res) => {
  try{
    const {blogId} = req.params;
    // console.log(req.params)
    const blog = await Blog.findByIdAndUpdate(blogId,{ $inc: { likeCount: 1 } },
      { new: true })
    console.log(blog)
    if(!blog){
       return res.status(404).send({status: false, msg: "blog not found"})
    }
    return res.status(200).send({status: true, msg: "blog liked successfully",likeCount: blog.likeCount})
  }catch(err){
    return res.status(500).send({status: false, msg: "server error"})
  }

}


module.exports = {createBlog, getBlogs, updateBlogs, softDeleteBlogs, deleteBlogs, updateLikeCount};

