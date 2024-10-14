const express = require("express");
const {creatUser, loginUser} = require("../controller/users");
const router = express.Router();


router.post("/create", creatUser)
router.post("/login", loginUser)


module.exports = router

