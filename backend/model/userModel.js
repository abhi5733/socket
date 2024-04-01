
const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({

    email : String ,
    name : String ,
    password : String ,
    rooms :  [{ type: mongoose.Schema.Types.ObjectId, ref: 'rooms' }] ,
    friends : [{
        id:String,
        chat:String,
        name: String
    }] 
})


const userModel = mongoose.model( "user" , userSchema)




module.exports = { userModel }