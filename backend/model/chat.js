const mongoose = require("mongoose")


const chatSchema = new mongoose.Schema({
    chats: [{
        sender: String,
        message: String,
        name:String
    }]

})

const chatModel = mongoose.model("chats" , chatSchema)


module.exports = {chatModel}