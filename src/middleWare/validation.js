const jwtoken = require("jsonwebtoken");
const Blogs = require("../models/blogs");



const authentication = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        res.status(401).send({message: "Token missing or invalid"})
    }
    await jwtoken.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if (err) {
            // console.log(err)
            return res.status(403).send({message:'Invalid token' });
         }
       req.user = user;
        //  console.log(req.user)
         next(); 
    });
}


const authorization = async (req, res, next) => {
    try{
      const blogId = req.params.blogId;
      const userId = req.user.userId;
      // console.log(userId)
      const blog = await Blogs.findById(blogId);
      // console.log(blog)
      if (!blog) {
        return res.status(404).json({message: "Blog not found" });
      }
      if (blog.userId.toString() !== userId) {
        console.log(blog.userId.toString())
       
        return res.status(403).json({message: "You are not authorized to perform this action" });
      }
     
      next()
    }catch(err){
        return res.status(500).json({ message: "Server error", err })
    }
}


module.exports = {authentication, authorization};