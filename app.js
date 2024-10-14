const express = require("express");
const mongoose = require("mongoose");
const users = require("./src/routes/users")
const blogs = require("./src/routes/blogs")



const app = express();


mongoose.connect("mongodb://localhost:27017/Blogging-side-backend")
                .then( () => console.log("connected to DB") )
                .catch( (err) => console.log(err) )


app.use(express.json());


app.use("/users", users)
app.use("/blogs", blogs)



app.listen(3000).on("listening", ()=>{
    console.log("listening on 3000")
});
