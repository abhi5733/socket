
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
const[id,setId] = useState("")     // setting socket id for direcct messages 
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
const[receiverName,setReceiverName] = useState("")
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
        // console.log(data,info)
        setDmtext((prev)=>[...prev , {message:data.text,receiver:data.name,name:data.name} ])
        // console.log(dmtext)
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
      console.log(data)
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


    ///////////////////////////////////  receiving group messages from other users
    socket.on("message" , (data)=>{
    
        console.log(data)
        setData((prev)=>[...prev, {message:data.data.message , name : data.data.info.name}])
        toast({
          title: `New message received`,
          status: 'success',
          duration: 500,
          isClosable: true,
          position: 'top'
        })

      
  
    })

    // Group message sent success to the individual user . 

    socket.on("Room-response" , (data)=>{
    
      if(data.success){
        // console.log(data)
      toast({
        title: `Message sent successfully`,
        status: 'success',
        duration: 500,
        isClosable: true,
        position: 'top'
      })
      setMessage("")
      }else{

        toast({
          title: `Error in sending message`,
          status: 'error',
          duration: 500,
          isClosable: true,
          position: 'top'
        })

      }
    })


    ////////////////////////////////////
    socket.on("join-room-response" , (msg)=>{
      if(msg.success){
        setToggle(true)
        console.log(msg)
//  console.log(msg.rooms.chats,msg)
   setNewRoom(false)  // setting it to false 
      setData(msg.rooms.chats ) , setRoomInfo(msg.rooms )  // setting the room chats info 
      toast({
        title: ` ${msg.rooms.roomName} Room joined`,
        description: `${msg.message}`,
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top'
      })
    }else{
      // console.log(msg)
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
  const handleText = (text)=>{
console.log(activeMembers)
let data ; 
  activeMembers.length>0?data = activeMembers.filter((el)=>el.data.name==receiverName):""
  let id = data.length>0?data[0].id : "" 

// console.log(id,text,info,receiver)
    socket.emit("dm" , ({id,text,user:info,receiver}))
    setDmtext((prev)=>[...prev,{message:text,receiver:info.name,name:info.name}])
  //   console.log(dmtext)
  setText("")
}


///////////////////////////////// group messages 
const handleSubmit = ()=>{ 

  // console.log(message,group , info)
  socket.emit("message" , ({message,group, info }))
  setData((prev)=>[...prev, {message, name:info.name}])
// console.log(data)
}


const handleSpecialCase = ()=>{

  setToggleActiveMembers((prev)=>!prev) 
   setToggleFriendChat(false) 
   setToggleRoomChat(false)
  setToggleActiveRooms(false) 

  // console.log(toggleActiveMembers)
}




// for joining the room

const joinRoom = (RoomName)=>{
 
   if(RoomName!==""  || group!==""){
  let groups =  RoomName || group
  socket.emit( "join-room" , ({group:groups, info}) )
   }else{
    toast({
      title: `Please enter Proper Room-name`,
      description: "Try later",
      status: 'error',
      duration: 2000,
      isClosable: true,
      position: 'top'
    }) }
   }




/////////////////////////////////// getting previous chats 
const  getPreviousChats = async (id)=>{

  const user = info.friends.filter((el)=>el.id==id)
// console.log(user)
  if(user.length>0){
// console.log(user[0].chat)
 
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

  setReceiverName(name)
   const user = activeMembers.filter((el)=>el.data.name==name) 
// console.log(user[0].data._id , activeMembers)
  setDm((prev)=>!prev) 
  if(user.length>0){
   /*setId(user[0].id) */  // setting socket id 
  setReceiver(user[0].data._id)  // setting Receivers  ID
  getPreviousChats(user[0].data._id)
  console.log(user[0].data._id)
  }


}


// handle Offline friend 
const handleOfflineFriend = (id,name)=>{
setReceiverName(name)
  // console.log(id)
  setId("") // setting socket id to emty string 
  setReceiver(id) // setting the receivers id 
  setDm((prev)=>!prev) 
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


<Flex   justifyContent={"center"}   >

<Box color={"white"}   display={toggle==true?"none":"block"}  width={toggle==true?"30vw":[  "80vw", "100vw" , "60vw" , "50vw"]} >
<Box   bgColor={toggle==true?"gray":"gray"} p={5}  borderRadius={toggle==true?"0px":"10px"} w={["100%" , "90%","auto" , "auto"]}  margin={toggle==true?"block":"auto"} mt={10} >  
<Heading textAlign={'center'} >Welcome   {info.name} </Heading>

<Flex mt={10} flexDirection={["column" , "row" , "row" , "row"]}  justifyContent={"space-between"} >
<Button  onClick={()=>{setToggleFriendChat((prev)=>!prev) , setToggleRoomChat(false) , setNewRoom(false) , setToggleActiveMembers(false) ,setToggleActiveRooms(false)}} bgColor={toggleFriendChat?"yellow":"white"}   >Chat with Friends</Button>
 {/* Friends List for mobile view */}

 <Box  display={["block" , "none" , "none" ,"none"]}  >  { toggleFriendChat &&  ( info.friends.length > 0 ? <Friends info={info} friends={friends} handleOnlineFriend={handleOnlineFriend}  setToggle={setToggle}  handleOfflineFriend={handleOfflineFriend} />:<Text mt={2}>No Friends Yet</Text>)

} </Box> 

<Button ml={[ 0,2,2 ,2]}  mt={[2,0,0,0]} onClick={()=>{setToggleRoomChat((prev)=>!prev), setToggleFriendChat(false) , setToggleActiveMembers(false) , setToggleActiveRooms(false) }} bgColor={toggleRoomChat?"yellow":"white"} >My Room</Button>

{/* My rooms  and New Rooms section for mobile view */}

 <Box display={["block" , "none" , "none" ,"none"]}> {(toggleRoomChat &&  Object.keys(info).length !== 0) && <MyRooms info={info} group={group}  setGroup={setGroup}  joinRoom={joinRoom} setToggle={setToggle}  newRoom={newRoom}   setNewRoom={setNewRoom}  /> } </Box> 


<Button ml={[ 0,2,2 ,2]}  mt={[2,0,0,0]}  onClick={handleSpecialCase}
 bgColor={toggleActiveMembers?"yellow":"white"} >Online Users</Button>

{/* Online Users for mobile view */}
{/* {console.log(activeMembers)} */}
<Box display={["block" , "none" , "none" ,"none"]}> {(toggleActiveMembers && activeMembers.length-1 > 0 )? <OnlineUsers toggleActiveMembers={toggleActiveMembers} activeMembers={activeMembers} info={info} friends={friends} setDm={setDm} setId={setId} setReceiver={setReceiver} getPreviousChats={getPreviousChats} setToggle={setToggle} /> : toggleActiveMembers ? <Box> <Text mt={2}>No Active Members</Text> </Box>:<>  </>

}  </Box> 
  
<Button ml={[ 0,2,2 ,2]}  mt={[2,0,0,0]}  onClick={getAllRooms} bgColor={toggleActiveRooms?"yellow":"white"} >All Rooms</Button>

{/* All rooms available for mobile view */}

 <Box display={["block" , "none" , "none" ,"none"]}>  {toggleActiveRooms &&   allRooms.length>0?allRooms.map((el)=>{
  return <Flex key={el._id} alignItems={"center"} >
<Text fontSize={20} >RoomName : {el.roomName}</Text>
<Button ml={2} size={"xs"} onClick={()=>{setToggle(true) ,setGroup(el.roomName),joinRoom(el.roomName)}}>Join</Button>
  </Flex>
}): toggleActiveRooms?<Text mt={2}>No Room Yet</Text>:""} </Box>

</Flex>


{/* active Members helper Function  */}

 <HelperOnlineuser activeMembers={activeMembers} info={info} friends={friends} />

 {/* Friends List */}

 <Box display={["none" , "block" , "block" ,"block"]} > { toggleFriendChat &&  ( info.friends.length > 0 ? <Friends  info={info} friends={friends} handleOnlineFriend={handleOnlineFriend}  setToggle={setToggle}  handleOfflineFriend={handleOfflineFriend} />:<Text mt={2}>No Friends Yet</Text>)

} </Box> 



{/* Online Users */}

<Box display={["none" , "block" , "block" ,"block"]} > {toggleActiveMembers==true &&  ( activeMembers.length-1>0 && Object.keys(info).length !==0 )? <OnlineUsers  setReceiverName={setReceiverName} toggleActiveMembers={toggleActiveMembers} activeMembers={activeMembers} info={info} friends={friends} setDm={setDm} setId={setId} setReceiver={setReceiver} getPreviousChats={getPreviousChats} setToggle={setToggle} /> :toggleActiveMembers==true?<Box> <Text mt={2}>No Active Members</Text> </Box>:""

} </Box> 




{/* My rooms  and New Rooms section */}

<Box display={["none" , "block" , "block" ,"block"]} > {(toggleRoomChat &&  Object.keys(info).length !== 0) && <MyRooms info={info} group={group}  setGroup={setGroup}  joinRoom={joinRoom} setToggle={setToggle}  newRoom={newRoom}   setNewRoom={setNewRoom}  /> } </Box> 

{/* All rooms available */}
<Box display={["none" , "block" , "block" ,"block"]} > 
{toggleActiveRooms && allRooms.map((el)=>{
  return <Flex key={el._id} alignItems={"center"} >
<Text fontSize={20} >RoomName : {el.roomName}</Text>
<Button ml={2} size={"xs"} onClick={()=>{setToggle(true) ,setGroup(el.roomName),joinRoom(el.roomName)}}>Join</Button>
  </Flex>
})  }
</Box>

</Box> 



</Box>

{/* ///////////////////////////////////////////////////  Toggle is true ///////////////////////////////////////////////////////////////////// */}

{/* group message */}
 <Box display={toggle==true?"block":"none"} width={toggle==true?"100%":""} h={"90vh"} pos={"relative"}  >


{/* Direct message */}
<Button  top={2} left={2}  bgColor={"yellow"} pos={"absolute"} onClick={()=>{setToggle(false), setDm(false) }} >Go Back</Button>


{ !dm && <Button  top={2} left={120}  bgColor={"yellow"} pos={"absolute"} onClick={leaveGroup}  >Exit Group</Button>}

{dm==true?<Box h={"80vh"} overflow={"scroll"} > 


  {dmtext.length>0 && dmtext.map((el)=>{

 return <Box  key={el._id} ml={el.name==info.name?"50%":"0%"} justifySelf={"end"}  w={"50%"} padding={2} > <Box   w={[ "100%" , "70%" , "60%" ,"50%"]} bgColor={el.name==info.name?"green.300":"blue.200"} p={5} borderRadius={"20px"}  ><Text fontWeight={"bold"} > {el.name==info.name?"You":el.name}</Text> <Text> {el.message}</Text> </Box>  </Box>  
})}

  
</Box>:<Box h={"80vh"} overflow={"scroll"} > {data.length  >0 && data.map((el, ind)=>{
  
return  <Box key={el._id} ml={(el.name || el.senderName)==info.name?"50%":"0%"} justifySelf={"end"}  w={"50%"} padding={2} > <Box  w={[ "100%" , "70%" , "60%" ,"70%"]} bgColor={(el.name || el.senderName)==info.name?"green.300":"blue.200"} p={5} borderRadius={"20px"}  ><Text fontWeight={"bold"} fontSize={"20px"} > {(el.name || el.senderName)==info.name?"You":(el.name || el.senderName)}</Text> <Text> {el.message}</Text> </Box>  </Box>  
  })}</Box>}

{/* Message Box */} 

<Box backgroundColor={"yellow"} pos={"absolute"}  bottom={0} w={"100%"} p={2} h={"10vh"}  >
  <Flex alignItems={"center"} > 
  <Input type="text" bgColor={"gray"} value={dm==true?text:message} cursor={"pointer"} color={"white"}  placeholder="enter message" w={"80%"}  onChange={(e)=> dm==true?setText(e.target.value):setMessage(e.target.value)} />
  <Button ml={5} onClick={()=>dm==true?handleText(text):handleSubmit()}>Message</Button>
  </Flex>
</Box>

  </Box>


</Flex>


</Box>
  
  )
}

export default Home