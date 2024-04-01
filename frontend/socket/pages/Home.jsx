
import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import {io}  from "socket.io-client"
import { Link } from 'react-router-dom'
import {useSelector,useDispatch} from "react-redux"
import { Box, Button, Flex, Heading , Input, Text , useToast } from '@chakra-ui/react'
import Friends from '../components/Friends'
import MyRooms from '../components/MyRooms'
import OnlineUsers from '../components/OnlineUsers'
import HelperOnlineuser from '../components/HelperOnlineuser'


const Home = () => {

const toast = useToast()  
const[message,setMessage] = useState("") // message for group
const[room,setRoom] = useState("")
const[data,setData] = useState([])
const[group,setGroup] = useState("")
const[activeUser , setActiveUser] = useState("")
const[info,setInfo] = useState({})
const[roomInfo,setRoomInfo] = useState({roomName:"123"})
const[activeMembers , setActiveMembers] = useState([])
const[dm,setDm] = useState(false)
const[text,setText] = useState("")  // direct message 
const[id,setId] = useState("")  
const[userId,setUserId] = useState("")
const[dmtext,setDmtext]  = useState([])
const[receiver,setReceiver] = useState("")  // setting id of receiver
const [friendList,setFriendList] = useState([])
const[onlineFriendName , setOnlineFriendName] = useState("")
const[joinRooms, setJoinRooms] = useState(false)
const[toggle,setToggle] = useState(false) // for togglig the UI 
const[toggleFriendChat,setToggleFriendChat] = useState(false)
const[toggleRoomChat , setToggleRoomChat] = useState(false)
const[newRoom , setNewRoom] = useState(false)
const[toggleActiveMembers,setToggleActiveMembers] = useState(false)
const[toggleActiveRooms,setToggleActiveRooms] = useState(false)
const[allRooms , setAllRooms] = useState([])
const friends = []




  const socket = useMemo(()=> io(`${process.env.URL}` , {
    withCredentials: true, 
    }),[])


    const name = useSelector((store)=>store.name)
    
   
    useEffect(  ()=>{

     axios.get(`${process.env.URL}/admin/myData` , {
        headers:{
            auth : localStorage.getItem("token")
        }
     }).then((res)=>{console.log(res.data), setInfo(res.data[0] , socket.emit("user-connected" , res.data[0] ) )})
     .catch((err)=>console.log(err))

    },[data])

  

  useEffect(()=>{


    // Messages
    socket.on( "dm" , (data)=>{
      if(!data.success){
        toast({
          title: `Something went wrong`,
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top'
        })
      }else{
        toast({
          title: `New message received`,
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top'
        })
        console.log(data,info)
        setDmtext((prev)=>[...prev , {message:data.text,receiver:data.name,name:data.name} ])
        console.log(dmtext)
      setText("")
        setUserId(data.id)
      }
   
  })


    //  getting active user
    socket.on("active-user" , (data)=>{
        setActiveUser(data)
    })


    // gettin data of active users
    socket.on("list-active-users" , (data)=>{
      setActiveMembers(data)
    })


    //////////////////////////////////
    socket.on("welcome" , (data)=>{
      console.log(data)
    } )


    //////////////////////////////////
    socket.on("connect" , ()=>{
      console.log("connected" , socket.id) ;
    })


    //////////////////////////////////
    socket.on("send-data" , (data)=>{
      console.log(data)
    })


    ///////////////////////////////////
    socket.on("message" , (data)=>{
      console.log(data)
      setData((prev)=>[...prev, {message:data.data.message , name : data.data.info.name}])
    })


    ////////////////////////////////////
    socket.on("join-room-response" , (msg)=>{
      if(msg.success){
 console.log(msg.rooms[0].chats,msg)
   setNewRoom(false)  // setting it to false 
      setData(msg.rooms[0].chats) , setRoomInfo(msg.rooms[0])  // setting the room chats info 
      toast({
        title: ` ${group} Room joined`,
        description: "Welcome to the Room",
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top'
      })
    }else{
      toast({
        title: `Unable to join room currently`,
        description: "Try again later",
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top'
      })
    }
    
    })


    return  ()=>{
     
      socket.disconnect()
    }


  },[])


  ////////////////////////////////// personnal messgaes
  const handleText = (id,text)=>{
console.log(id,text)
    socket.emit("dm" , ({id,text,user:info,receiver}))
    setDmtext((prev)=>[...prev,{message:text,receiver:info.name,name:info.name}])
    console.log(dmtext)
  setText("")
}


///////////////////////////////// group messages 
const handleSubmit = ()=>{ 

  // console.log(message,group , info)
  socket.emit("message" , ({message,group, info }))
  setData((prev)=>[...prev, {message, name:info.name}])
console.log(data)
}


// /////////////////////////////
// const getAllRoomsUser = (name)=>{
//   console.log(group)
  
//    axios.get(`http://localhost:7300/admin/roomUsers/${name}` , {
//     headers:{
//       auth : localStorage.getItem("token")
//   }
//    }).then((res)=>{ setActiveMembers(res.data.members)})
//    .catch((err)=>console.log(err))

// }



// for joining the room

const joinRoom = (RoomName)=>{
 
  // console.log(group,info)
  let groups =  RoomName || group
  socket.emit( "join-room" , ({group:groups, info}) )
 
}



/////////////////////////////////// getting previous chats 
const  getPreviousChats = async (id)=>{

  const user = info.friends.filter((el)=>el.id==id)
console.log(user)
  if(user.length>0){
console.log(user[0].chat)
 
 await axios.get(`${process.env.URL}/admin/private-chats`,{
  headers:{
    auth : localStorage.getItem("token"),
    id :user[0].chat
}
 }).then((res)=>{console.log(res),setDmtext(res.data.chats.chats)})
 .catch((err)=>console.log(err))


}else{
console.log(2)
}
}


//  handling online friend 
const handleOnlineFriend = (name)=>{

  
   const user = activeMembers.filter((el)=>el.data.name==name) 
// console.log(user[0].data._id , activeMembers)
  setDm((prev)=>!prev) 
  if(user.length>0){
  setId(user[0].id)  // setting socket id 
  setReceiver(user[0].data._id)  // setting Receivers  ID
  getPreviousChats(user[0].data._id)
  console.log(user[0].data._id)
  }


}


// handle Offline friend 
const handleOfflineFriend = (id)=>{

  console.log(id)
  setReceiver(id) // setting the receivers id 
  setDm((prev)=>!prev) 
console.log(id)
  getPreviousChats(id)
}



// getting all the rooms 
const getAllRooms = ()=>{

  if(!toggleActiveRooms){
  axios.get(`${process.env.URL}/admin/get-all-rooms` , {
    headers:{
      auth : localStorage.getItem("token") 
  }
  }).then((res)=>{console.log(res.data.rooms),setAllRooms(res.data.rooms) , setToggleActiveRooms(true)})
  .catch((err)=>{console.log(err) ,   toast({
    title: `Unable to get rooms at this time`,
    description: "Try later",
    status: 'error',
    duration: 2000,
    isClosable: true,
    position: 'top'
  }) })
  setToggleActiveMembers(false)
  setToggleRoomChat(false)
  setToggleFriendChat(false) 
}else{
  setToggleActiveRooms(false)
  setToggleActiveMembers(false)
  setToggleRoomChat(false)
  setToggleFriendChat(false) 

}
}


//  leaving group 
const leaveGroup = ()=>{

    socket.emit("beforeDisconnect" , ({group, info}))


   socket.on("leftGroup"  , (data)=>{
    setData([])
    if(data.success){
      setRoomInfo({roomName:"123"})
      setToggle(false), setDm(false)
    toast({
      title: `left room successfully`,
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top'
    })

  }else{
    toast({
      title: `Something went wrong`,
      status: 'error',
      duration: 2000,
      isClosable: true,
      position: 'top'
    })

  }
    
   })

}



  return (

    <Box> 


<Flex   justifyContent={"center"}  >

<Box color={"white"}   display={toggle==true?"none":"block"} width={toggle==true?"30vw":"auto"} >
<Box   bgColor={toggle==true?"gray":"gray"} p={5}  borderRadius={toggle==true?"0px":"10px"}   margin={toggle==true?"block":"auto"} mt={10} >  
<Heading textAlign={'center'} >Welcome   {info.name} </Heading>

<Flex mt={10} justifyContent={"space-around"} >
<Button onClick={()=>{setToggleFriendChat((prev)=>!prev) , setToggleRoomChat(false) , setNewRoom(false) , setToggleActiveMembers(false) ,setToggleActiveRooms(false)}} >Chat with Friends</Button>
<Button ml={2} onClick={()=>{setToggleRoomChat((prev)=>!prev), setToggleFriendChat(false) , setToggleActiveMembers(false) , setToggleActiveRooms(false) }} >My Room</Button>
<Button ml={2} onClick={()=>{setToggleActiveMembers((prev)=>!prev) , setToggleFriendChat(false) ,setToggleRoomChat(false) ,  setToggleActiveRooms(false),console.log(toggleActiveMembers)}} >Online Users</Button>
<Button ml={2} onClick={getAllRooms}>All Rooms</Button>
</Flex>


{/* active Members helper Function  */}

 <HelperOnlineuser activeMembers={activeMembers} info={info} friends={friends} />





{/* Online Users */}

{toggleActiveMembers==true &&  ( activeMembers.length-1>0 && Object.keys(info).length !==0 )? <OnlineUsers toggleActiveMembers={toggleActiveMembers} activeMembers={activeMembers} info={info} friends={friends} setDm={setDm} setId={setId} setReceiver={setReceiver} getPreviousChats={getPreviousChats} setToggle={setToggle} /> :toggleActiveMembers==true?<Box> <Text mt={2}>No Active Members</Text> </Box>:""

}


 {/* Friends List */}

{ toggleFriendChat &&  ( info.friends.length > 0 ? <Friends info={info} friends={friends} handleOnlineFriend={handleOnlineFriend}  setToggle={setToggle}  handleOfflineFriend={handleOfflineFriend} />:<Text mt={2}>No Friends Yet</Text>)

}

{/* My rooms  and New Rooms section */}

{(toggleRoomChat &&  Object.keys(info).length !== 0) && <MyRooms info={info} group={group}  setGroup={setGroup}  joinRoom={joinRoom} setToggle={setToggle}  newRoom={newRoom}   setNewRoom={setNewRoom}  /> }

{/* All rooms available */}

{toggleActiveRooms && allRooms.map((el)=>{
  return <Flex alignItems={"center"} >
<Text fontSize={20} >RoomName : {el.roomName}</Text>
<Button ml={2} size={"xs"} onClick={()=>{setToggle(true) ,setGroup(el.roomName),joinRoom(el.roomName)}}>Join</Button>
  </Flex>
})  }

</Box> 



</Box>

{/* group message */}
 <Box display={toggle==true?"block":"none"} width={toggle==true?"100%":""} h={"90vh"} pos={"relative"}  >


{/* Direct message */}
<Button  top={2} left={2}  bgColor={"yellow"} pos={"absolute"} onClick={()=>{setToggle(false), setDm(false) }} >Go Back</Button>
{ !dm && <Button  top={2} left={120}  bgColor={"yellow"} pos={"absolute"} onClick={leaveGroup}  >Exit Group</Button>}
{dm==true?<Box h={"80vh"} overflow={"scroll"} > 


  {dmtext.length>0 && dmtext.map((el)=>{

 return <Box key={el._id} ml={el.name==info.name?"50%":"0%"} justifySelf={"end"}  w={"50%"} padding={2} > <Box w={"50%"} bgColor={el.name==info.name?"green":"blue"} p={5} borderRadius={"20px"}  ><Text> {el.name==info.name?"You":el.name}</Text> <Text> {el.message}</Text> </Box>  </Box>  
})}

  
</Box>:<Box h={"80vh"} overflow={"scroll"} > {data.length  >0 && data.map((el, ind)=>{
  
return  <Box key={el._id} ml={(el.name || el.senderName)==info.name?"50%":"0%"} justifySelf={"end"}  w={"50%"} padding={2} > <Box w={"50%"} bgColor={(el.name || el.senderName)==info.name?"green":"blue"} p={5} borderRadius={"20px"}  ><Text> {(el.name || el.senderName)==info.name?"You":(el.name || el.senderName)}</Text> <Text> {el.message}</Text> </Box>  </Box>  
  })}</Box>}

{/* Message Box */} 

<Box backgroundColor={"yellow"} pos={"absolute"}  bottom={0} w={"100%"} p={2} h={"10vh"}  >
  <Flex alignItems={"center"} > 
  < Input type="text" bgColor={"gray"} value={dm==true?text:message} cursor={"pointer"} color={"white"}  placeholder="enter message" w={"80%"}  onChange={(e)=> dm==true?setText(e.target.value):setMessage(e.target.value)} />
  <Button ml={5} onClick={()=>dm==true?handleText(id,text):handleSubmit()}>Message</Button>
  </Flex>
</Box>

  </Box>


</Flex>


</Box>
  
  )
}

export default Home