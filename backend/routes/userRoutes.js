
const express = require("express")
const {userModel} = require("../model/userModel")
const  { User, Comment } = require("../model/practise")
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const userRouter = express.Router()



///////////////////////////////////////////// signup Route  ///////////////////////////////////////////////////////


userRouter.post("/signup" , async(req,res)=>{

    try{
        const prevUser = await userModel.findOne({name:req.body.name})

        if(prevUser){ // username is unique
            res.status(409).send({"msg":"UserName already Exists"})

        }else{
            
            const newUser = userModel(req.body)
            await newUser.save()
            res.status(200).send({"msg":"User updated successfully" , newUser })
        }

       

    }catch(err){

        res.status(400).send(err)

    }


})


///////////////////////////////////////////////////////  Login Route  /////////////////////////////////////////////////////

userRouter.post("/login" , async(req,res)=>{

    const {name,password} = req.body

    try{
        console.log(req.body)
        const User = await userModel.find({name,password})
        
if(User.length>0){

    const token = jwt.sign({ UserId : User[0]._id }, 'masai');
  
    res.status(200).send({"msg":"User logged in" ,  token })
}else{
  res.status(400).send({"msg":"Signup first"})
}

       
        

    }catch(err){

        res.status(400).send({"msg":"Somethinng went wrong" , err})

    }

})



// // Creating the User for  testing refrencing  

// userRouter.post("/newuser" , async (req,res)=>{

//     try{

//         const user =  User(req.body)
//          await user.save()
//          res.send({"msg":"User created successfully" , user})
//     }catch(err){

//         res.send(err)

//     }


// })

//  // creating new comment always 

//  userRouter.post("/comment" , async (req,res)=>{

//     try{

//         const newMsg =  Comment(req.body)
//          await newMsg.save()
//          res.send({"msg":"User created successfully" , newMsg})
//     }catch(err){

//         res.send(err)

//     }


// })


 

//  userRouter.get('/users/:userId/comments', async (req, res) => {
//     console.log(req.params.userId)
//     try {
//         const user = await User.findById(req.params.userId).populate('comments');
//         res.send(user);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });


// userRouter.get("/cookie" , (req,res)=>{

//         res.cookie("key", "abhi") ;
//         res.send('Cookie set successfully');

// })



module.exports = {userRouter}


















