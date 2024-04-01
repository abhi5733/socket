const { userRoomsModel, roomChatModel } = require("../model/Rooms");
const { chatModel } = require("../model/chat");
const { userModel } = require("../model/userModel");
let activeUsers = []  // storing all active users 
const { Server } = require("socket.io")



  const  initializeSocket = (server,app)=>{

    

// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:5173",
//         methods: ["GET", "POST"],
//         credentials: true
//     }
// });



const io = new Server(server, {
    cors: {
        origin: "https://socket-ergd.vercel.app/",
        methods: ["GET", "POST"],
        credentials: true
    }
});


// app.use(cors({
//     origin: "http://localhost:5173/",
//     methods: ["GET", "POST"],
//     credentials: true
// }));

app.use(cors())


app.get("/", (req, res) => {
    res.send("Hello world")
})


io.on("connection", async (socket) => {

    console.log("User Connected", socket.id)

socket.on("user-connected" , (data)=>{
  console.log(data , socket.id)
  activeUsers.push({data, id:socket.id}) // storingsocket id for direct messaging 
  console.log(activeUsers)
// emitting to entire circuit .
  io.emit("list-active-users" , activeUsers)    

})
    

    const count = io.engine.clientsCount ;
// socket.broadcast.emit("welcome" , `${socket.id} joined the server`)
   socket.emit("active-user" , count)
 
    console.log(count)

//  socket.emit("welcome" , `Welcome to the server ${socket.id}`)
 

    //////////////////////////////////////////////// creating message event 

    socket.on("message", async (data) => {

          // saving chat in roomchat collection 
   
           const newChat = roomChatModel({message : data.message ,
           senderId : data.info._id ,
           senderName : data.info.name , 
           groupName : data.group
         })
           await newChat.save()
           const rooms = await userRoomsModel.findOneAndUpdate({ roomName:data.group} , {$push:{chats:newChat._id}} , {new:true}).populate("chats")
           
        // const room = await userRoomsModel.find({ roomName:data.group}).populate("chats")
        // console.log(data.group , data.message)
        // io.emit("messages", data.message)
        // socket.broadcast.emit("tom" , data.message)
        // io.to(data.group).emit("tom" , data.message)
        socket.to(data.group).emit("message",{ data , rooms})

 
   // pushing chat id in room  model 

        
        console.log(rooms)

    })

///////////////////////////////////////////////// Direct message to user 


  socket.on("dm" , async (data)=>{
console.log(data)
 const session = await userModel.startSession()
 session.startTransaction();

    try{


        const user = await userModel.findById(data.receiver)
        const user2 = await userModel.findById(data.user._id)
     
        // if online 

        if(data.id!==""){


    // if already friends 
    if(user.friends.some(friend => friend.id === data.user._id)){
const users = user.friends.filter(friend => friend.id === data.user._id)

        const text =  await chatModel.findByIdAndUpdate(users[0].chat , { $push: { chats: {message:data.text , sender:data.user._id , name:data.user.name }} } , {new:true ,   session } )
  
        socket.to(data.id).emit("dm" ,{text:data.text,id:data.user._id,name:data.user.name , success:true})
    }else{
     // if new friends           
        const text = new chatModel({chats:[{sender:data.user._id, message:data.text , name:data.user.name}]})
        await text.save({ session})
        console.log(text)
        user.friends.push({id:data.user._id , chat:text._id , name :data.user.name })
    
        user2.friends.push({id:data.receiver, chat:text._id , name:user.name })
        
        await user.save({ session})
        await user2.save({ session})
        socket.to(data.id).emit("dm" ,{text:data.text,id:data.user._id,name:data.user.name ,success:true})
        
    }

}else{ // if offline

    if(user.friends.some(friend => friend.id === data.user._id)){
        const users = user.friends.filter(friend => friend.id === data.user._id)
        
                const text =  await chatModel.findByIdAndUpdate(users[0].chat , { $push: { chats: {message:data.text , sender:data.user._id , name:data.user.name }} } , {new:true ,   session } )
          
                // socket.emit("dm" ,{text:data.text,id:data.user._id,name:data.user.name , success:true})
            }else{
             // if new friends           
                const text = new chatModel({chats:[{sender:data.user._id, message:data.text , name:data.user.name}]})
                await text.save({ session})
                console.log(text)
                user.friends.push({id:data.user._id , chat:text._id , name :data.user.name })
            
                user2.friends.push({id:data.receiver, chat:text._id , name:user.name })
                
                await user.save({ session})
                await user2.save({ session})
                // socket.emit("dm" ,{text:data.text,id:data.user._id,name:data.user.name ,success:true})
                
            }
        


}

    await session.commitTransaction();
    session.endSession();


}catch(err){


    await session.abortTransaction();
    session.endSession();
    console.error(err);
    socket.emit("dm" ,{success:false,err})


}


  })



    //////////////////////////////////////////////////////  join the room 

    socket.on("join-room", async ({group , info}) => {

        try{
        
        console.log(group , info) 
       
const rooms = await userRoomsModel.find({ roomName:group}).populate("chats")  //checking if group already exists
 const user = await userModel.find({_id:info._id})  // getting user details 

// if group already exists

if(rooms.length>0){
     
// if already part of group

if(rooms[0].members.includes(info._id)){
socket.join(group)
socket.emit("join-room-response", { success: true, message: "You are already part of room" , rooms });
   
}else{

 //  if not part of group 

     user[0].rooms.push(rooms[0]._id)   // pushing id of group inside user
    await user[0].save()
    rooms[0].members.push(user[0]._id)  // pushing id of user into group 
    await rooms[0].save()
    socket.join(group)
    socket.emit("join-room-response", { success: true, message: "Room exists and you have been added" , rooms });
  
}
}else{
     
//   if group doesn't exist . 

  const newRoom = userRoomsModel({ roomName:group}) // creating a new group
   
await  newRoom.save()
user[0].rooms.push(newRoom._id)  // pushing id of new group inside user
await user[0].save()
newRoom.members.push(user[0]._id)  // pushing id of user into group 
await newRoom.save()

socket.join(group)
   
   socket.emit("join-room-response", { success: true, message: "Room created and joined successfully." , rooms: newRoom });

}
        }catch(err){
            socket.emit("join-room-response", { success: false, message: err  });  
        }

    })


   







    ////////////////////////////////////////// leaving the room


    socket.on("beforeDisconnect" , async ({group , info})=>{

        const session = await userModel.startSession(); // this will insure that either everything goes well or the changes are reverted back 
        session.startTransaction();
    
       try{

        const room =  await  userModel.findOne({ name: info.name }).populate('rooms')
      
        console.log(room,"room")
       const id = room.rooms.filter((el)=>el.roomName==group) // getting the room id
       console.log(id[0]._id)
       const roomId = id[0]._id
       await userModel.findOneAndUpdate({ name: info.name } ,{ $pull: { rooms:  roomId   } },{ new: true , session} )  // removing room id from user
      await  userRoomsModel.findOneAndUpdate({ roomName:group} ,{$pull : { members : info._id } } ,   { session } ) // removing user id from room members  .
      await roomChatModel.updateMany({groupName: group , senderName:info.name} , {$set:{senderName:"Deleted User"}} ,  { session })
       await session.commitTransaction();
       session.endSession();
       socket.leave(group)
       socket.emit("leftGroup" , {  success:true , message: `${info.name} has left the room` ,  info  })
    }catch(err){
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        socket.emit("leftGroup" , { success:false ,  message: `${info.name} has left the room` ,  info  })
    }
       //   await  userRoomsModel.findOneAndUpdate({roomName: group}, {$pull:{members:{name:info.name}}}).populate("members")
        //   await  roomChatModel.findOneAndUpdate({})      
     
    })




///////////////////////////////////////////////  disconnecting the socket 

socket.on("disconnect", () => {
        
    activeUsers = activeUsers.filter((el)=> el.id!==socket.id)
        console.log(`User Disconnected ${socket.id} `)
        io.emit("list-active-users" , activeUsers)     
    })


})



  }


  module.exports = {initializeSocket}