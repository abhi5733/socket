const mongoose = require("mongoose")


const Rooms = new mongoose.Schema({
    roomName : String ,
    members : [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }] ,
    chats : [{ type:mongoose.Schema.Types.ObjectId , ref:"roomChat" }]
})

const RoomChat = new mongoose.Schema({
message : String ,
senderId : String ,
senderName : String ,
groupName : String
})


const roomChatModel = mongoose.model("roomChat" , RoomChat)

const userRoomsModel = mongoose.model( "rooms" ,  Rooms)


module.exports = { userRoomsModel , roomChatModel }
