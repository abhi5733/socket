const express = require("express")
const { Server } = require("socket.io")
const { createServer } = require("http")

const {userRouter} = require("./routes/userRoutes")
const {authentication} = require("./middleware/Authentication")
const {connection} = require("./db")
const {adminRouter} = require("./routes/adminRoute")
const {userMessage} = require("./model/Message")
const {userRooms }  = require("./model/Rooms")
const {userModel}  = require("./model/userModel")
const {chatModel} = require("./model/chat")
const { initializeSocket } = require("./routes/socket")


const app = express()
let activeUsers = []  // storing all active users 
const server = createServer(app)
app.use(express.json())
app.use(cors())
app.use("/user" , userRouter)
app.use(authentication) 
app.use("/admin" , adminRouter)

// const io = new Server(server, {
//     cors: {
//         origin: "https://socket-ergd.vercel.app",
//         methods: ["GET", "POST"],
//         credentials: true
//     }
// }); 

initializeSocket(server,app);



server.listen(7300, async () => {

    try{
        await connection
        console.log("Mongo DB database connected")
    }catch(err){
        console.log({"msg" : "Database not connected" , err})
    }
    
    console.log(`Server is running on Port 7300`)

})

