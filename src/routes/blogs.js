const express = require("express");
const { createBlog, getBlogs, updateBlogs, softDeleteBlogs, deleteBlogs, updateLikeCount } = require("../controller/blogs");
const { authentication, authorization } = require("../middleWare/validation");
const router = express.Router();


router.post("/", authentication, createBlog)
router.get("/", authentication, getBlogs)
router.put("/:blogId", authentication, authorization, updateBlogs)
router.delete("/:blogId", authentication, authorization, softDeleteBlogs)
router.delete("/delete-all/:userId", authentication, deleteBlogs)
router.patch("/like/:blogId", authentication, updateLikeCount)



module.exports = router
 




