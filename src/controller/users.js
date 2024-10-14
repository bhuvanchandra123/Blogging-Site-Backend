const bcrypt = require("bcrypt")
const User = require("../models/users");
const jwtoken = require("jsonwebtoken")
require('dotenv').config();


const creatUser = async (req, res) => {
    const {fName, lName, email, password} = req.body;
      if(!fName || !lName || !email || !password){
         return res.status(400).json({message: "missing required fields"})
      }
      if(password.length < 8){
         return res.status(400).json({message: "password should contain minimum 8 characters"})
      }
     try{
        const existEmail = await User.findOne({email});
        if(existEmail){
            return res.status(400).json({status: false, msg: "email alredy exist"})
        }
        const hashPassword = await bcrypt.hash(password, 10);

      //   const newUser = new User({
      //       fName,
      //       lName,
      //       email,
      //       password: hashPassword
      //   });
      //  await newUser.save();

       const newUser = await User.create({
            fName,
            lName,
            email,
            password: hashPassword
       })

       return res.status(201).send({status: true, msg: "user created successfully", data: newUser});
     }catch(err){
        res.status(500).send({message: "server error"})
     }
};


const loginUser = async (req, res) => {
     const {email, password} = req.body;
     if(!email || !password){
        return res.status(400).send({status: false, msg: "email and password required"})
     }
     try{
        const existuser = await User.findOne({email});
        if(!existuser){
           return res.status(400).send({status: false, msg: "email id does not exist"})
        }
        const isPasswordValid = await bcrypt.compare(password, existuser.password)
        if(!isPasswordValid){
           return res.status(400).send({status: false, msg: "invalid password"})
        }
        // jwt token 
        const token = jwtoken.sign(
         {userId: existuser._id},
         process.env.JWT_SECRET,
         { expiresIn: '24h' } 
      )
        return res.status(200).send({status: true, msg: "login successful", token})
     } catch (error) {
      console.log("error", error)
        return res.status(500).send({ message: "Something went wrong", error });
    }
}


module.exports = {creatUser, loginUser};


console.log(process.env.JWT_SECRET)