import { useEffect, useMemo, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import {io}  from "socket.io-client"

function App() {

  const[message,setMessage] = useState("") // message
  const[room,setRoom] =useState("")
  const[data,setData] = useState([])
  const[group,setGroup] = useState("")

  const socket = useMemo(()=> io("http://localhost:7300"),[])

  // const socket = useMemo(()=> io("https://socket-one-omega.vercel.app/" , {
  //   withCredentials: true, 
  //   }),[])
    
  useEffect(()=>{
    
    socket.on("connect" , ()=>{
      console.log("connected" , socket.id) ;
    })

    socket.on("send-data" , (data)=>{
      console.log(data)
    })
    
    socket.on("message" , (msg)=>{
      setData((prev)=>[...prev,msg])
      console.log(msg)
    })


    return ()=>{
      socket.disconnect()
    }

  },[])


  const handleSubmit = (e)=>{ 

  e.preventDefault()
  socket.emit("message" , {message,room})
 
}

const handleRoom = (e)=>{
e.preventDefault()
socket.emit("join-room" ,room)
}


  return (
    <>

     <h2>Joi Room</h2>
      <form onSubmit={handleRoom} >
      <input type='text' value={group} onChange={(e)=>setGroup(e.target.value)}  />
      <button type='submit' >Submit</button>
      </form>

      
     <h1>Form Data</h1>

<form onSubmit={handleSubmit} >
  <input type='text' value={message} onChange={(e)=>setMessage(e.target.value)}  />
 <input type='text' value={room} onChange={(e)=>setRoom(e.target.value)} />
  <button type='submit' >Submit</button>
</form>

{
  data.length>0 && 
  data.map((el)=>{
    return <h1>{el}</h1>
  })
}

    </>
  )
}

export default App
