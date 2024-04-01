const mongoose = require("mongoose")

const Message = new mongoose.Schema({
    name : String ,
    messages : Array 
})


const userMessage = mongoose.model( "message" ,  Message)


module.exports = {userMessage}