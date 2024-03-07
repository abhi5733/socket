const express = require("express")
const  {Server} = require("socket.io")
const {createServer} = require("http")
const cors = require("cors")

const app = express()

const server = createServer(app)

const io = new Server(server);

// app.use(cors({
//     origin: "*",
//     methods: ["GET", "POST"],
//     credentials: true
// }));
app.use(cors())

app.get("/" , (req,res)=>{
    res.send("Hello world")
})


io.on("connection" ,(socket)=>{

console.log("User Connected" , socket.id)

// socket.emit("welcome" , `Welcome to the server ${socket.id}`)
// socket.broadcast.emit("welcome" , `${socket.id} joined the server`)

// creating message event 

socket.on( "message"  , (data)=>{  
console.log(data)
socket.to(data.room).emit("message" , data.message)

// socket.broadcast.emit( "send-data" ,  data)


})

socket.on("join-room", (room)=>{

    socket.join(room)

})


socket.on("disconnect" , ()=>{

console.log(`User Disconnected ${socket.id} `)

})


})



server.listen(7300,()=>{
    console.log(`Server is running on Port 7300`)
})