
const express = require("express")
const { userRoomsModel, roomChatModel } = require("../model/Rooms")
const adminRouter = express.Router()
// const {userRooms} = require("../model/Rooms")
const { chatModel } = require("../model/chat")
const  {userModel}  = require("../model/userModel")
const { upload } = require("../middleware/multer")
const fs = require('fs');
const path = require('path');
const { uploadonCloudinary } = require("../cloudinary")

adminRouter.get("/myData" , async (req,res)=>{

    try{
        const id = req.body.UserId
        console.log(id)
        const data = await userModel.find({_id:id}).populate("rooms")
        res.status(200).send(data)
    }catch(err){

        res.status(404).send(err)

    }


})


// adminRouter.get("/roomUsers/:name" , async (req,res)=>{

//     try{
//        const name =   req.params.name
//        const users = await userRooms.findOne({roomName:name}).populate("members")
      
//        res.send(users)
//     }catch(err){
//         res.send(err)
//     }

// })




adminRouter.get("/private-chats" , async (req,res)=>{

    try{
        const id = req.headers.id
 const chats = await chatModel.findById(id)
        res.status(200).send({"msg":"chats received successfully" , chats})

    }catch(err){
    
        res.status(404).send(err)
    
    }

})


// Rooms routes  

adminRouter.post("/join-room" , async (req,res)=>{

    try{

        //  check whether such room exist 

        const room = await userRoomsModel.find({ roomName :req.body.name})

        if(room.length>0){

         
            
        }else{
            //  creating the room first 
            const newRoom = userRoomsModel({ roomName:req.body.name})
            await newRoom.save()
           
            // searching the user to push the room id 
            const user = await  userModel.findByIdAndUpdate(req.body.UserId, {$push:{}})
             

            console.log(newRoom)
        }



    }catch(err){


    }

})


 ///////////////////////////////////////////////////////   Getting all the rooms available    ///////////////////////////////////////////////////////


 adminRouter.get("/get-all-rooms" , async (req,res)=>{

    try{

        const rooms = await userRoomsModel.find()
        res.status(200).send({"msg":"All rooms received successfully" , rooms})


    }catch(err){

       res.status(400).send({"msg":"something went wrong" ,"error": err})

    }

 })




 ////////////////////////////////////////////////////  Uploading Resume ///////////////////////////////////////////////////////////////


// uploading resume 

adminRouter.post('/uploadResume',  upload.single('resume'), async (req, res) => {
    // Handle file upload

    try{
  
    const { filename, path } = req.file;
    console.log(req.headers.userid)
    // Save file metadata to database
    // For MongoDB integration, use Mongoose or any other MongoDB driver
   const cloud = await  uploadonCloudinary(path)
   console.log(cloud,"hello")
  
//    deleting the file from system
   deleteFile(path)

  res.send(cloud);

   }catch(err){
    res.status(404).send(err)
   }

  });


  //////////////////////////////////////////////////  Delete file Path  ///////////////////////////////////////////////////////////////

  
const deleteFile = (filePath) => {
    // Construct the full path to the file
    const fullPath = path.join(filePath);
  
    // Check if the file exists
    if (fs.existsSync(fullPath)) {
      // Delete the file
      fs.unlinkSync(fullPath);
      console.log(`File ${filePath} deleted successfully.`);
    } else {
      console.log(`File ${filePath} does not exist.`);
    }
  };




module.exports = {adminRouter}