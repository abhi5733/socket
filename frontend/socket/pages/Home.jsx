
import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import {io}  from "socket.io-client"
import { Link } from 'react-router-dom'
import {useSelector,useDispatch} from "react-redux"
import { Box, Button, Flex, FormLabel, Heading , Input, TagLabel, Text , useToast , Image ,Avatar} from '@chakra-ui/react'
import Friends from '../components/Friends'
import MyRooms from '../components/MyRooms'
import OnlineUsers from '../components/OnlineUsers'
import HelperOnlineuser from '../components/HelperOnlineuser'
import { IoDocumentAttachOutline } from "react-icons/io5";


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
const[file,setFile] = useState("")
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
      console.log(data)
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
          title: `New message received from ${data.name}`,
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
          title: `New message received from ${data.name}`,
          status: 'success',
          duration: 500,
          isClosable: true,
          position: 'top'
        })

      
  
    })

    // Group message sent success to the individual user . 

    socket.on("Room-response" , (data )=>{
    
      if(data.success){
        // console.log(data)
      toast({
        title: `Message sent successfully`,
        status: 'success',
        duration: 500,
        isClosable: true,
        position: 'top'
      })
      setFile("")
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

/////////////////////////////////////////////// handleFileChange //////////////////////////////////////////////////////

const handleFileChange = (e) => {
  console.log(e.target.files[0])
  setFile(e.target.files[0]);
};




  ////////////////////////////////// personnal messgaes
  const handleText = async (text)=>{

    if(text!=="" || file!==""){

if(text!==""){
// console.log(activeMembers)
let data ; 
  activeMembers.length>0?data = activeMembers.filter((el)=>el.data.name==receiverName):""
  let id = data.length>0?data[0].id : "" 

// console.log(id,text,info,receiver)
    socket.emit("dm" , ({id,text,user:info,receiver}))
    setDmtext((prev)=>[...prev,{message:text,receiver:info.name,name:info.name}])
  //   console.log(dmtext)
  setText("")

}else if(file!==""){

 const result = await handleFileSubmit()

 if(result!==null){
  socket.emit("dm" , ({id,text:result.data.url,user:info,receiver}))
  setDmtext((prev)=>[...prev,{message:result.data.url,receiver:info.name,name:info.name}])

 }

}


    }else{
      toast({
        description: "Enter some text first",
        status: 'error',
        position:"top",
        duration: 2000,
        isClosable: true,
      })
    
    }


}


////////////////////////////////////////////////////////////////////  group messages    /////////////////////////////////////////////////////////////////////////////////

const handleSubmit = async ()=>{ 

  if(message!=="" || file!==""){

    if(message!==""){

  console.log(message,group , info,"message")
  socket.emit("message" , ({message,group, info }))
  setData((prev)=>[...prev, {message, name:info.name}])
// console.log(data)
    }else if(file!==""){
      // console.log(file,"file")

   const result =  await  handleFileSubmit()
   console.log(result)
   if(result!==null){

   socket.emit("message" , ({message: result.data.url , group, info }))
   setData((prev)=>[...prev, {message: result.data.url, name:info.name}])
  
   }
    }
}else{
  alert("Type some message")
}
}


////////////////////////////////////////////////////////////////  handle file submit ///////////////////////////////


const handleFileSubmit = async () => {
  // e.preventDefault();

 
  const formData = new FormData();
  formData.append('resume', file);
  // formData.Userid = data._id
  // console.log(formData)
  try {
    const response = await axios.post(`${process.env.URL}/admin/uploadResume`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        auth : localStorage.getItem("token"),
        "Userid" : data._id
      }
    });
    console.log('File uploaded successfully:', response);
    return response

    dm==true?setDmtext((prev)=>[...prev,{message:response.data.url,receiver:info.name,name:info.name}]):setData((prev)=>[...prev, {message:response.data.url, name:info.name}])
    // setMoreData(response.data)
    setFile("")
    // setUploadResume(false)
    response.data.url.includes("pdf")?  toast({
      description: "File posted successfully",
      status: 'success',
      position:"top",
      duration: 2000,
      isClosable: true,
    }) : toast({
      description: "Image posted successfully",
      status: 'success',
      position:"top",
      duration: 2000,
      isClosable: true,
    }) 
  } catch (error) {
    console.error('Error uploading file:', error);
  

  toast({
    description: "Choose you file for upload first",
    status: 'error',
    position:"top",
    duration: 2000,
    isClosable: true,
  })
  return null

}
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
console.log("online")
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
  console.log("offline")
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
{/* active Members helper Function  */}

<HelperOnlineuser activeMembers={activeMembers} info={info} friends={friends} />

<Flex   justifyContent={"center"}   >

<Box color={"white"}   display={toggle==true?"none":"block"}  width={toggle==true?"30vw":[  "80vw", "100vw" , "60vw" , "50vw"]} >
<Box   bgColor={toggle==true?"gray":"gray"} p={5}  borderRadius={toggle==true?"0px":"10px"} w={["100%" , "90%","auto" , "auto"]}  margin={toggle==true?"block":"auto"} mt={10} >  
<Heading textAlign={'center'} >Welcome   {info.name} </Heading>

<Flex mt={10} flexDirection={["column" , "row" , "row" , "row"]}  justifyContent={"space-between"} >
<Button  onClick={()=>{setToggleFriendChat((prev)=>!prev) , setToggleRoomChat(false) , setNewRoom(false) , setToggleActiveMembers(false) ,setToggleActiveRooms(false)}} bgColor={toggleFriendChat?"yellow":"white"}   >Chat with Friends</Button>
 {/* Friends List for mobile view */}

 <Box  display={["block" , "none" , "none" ,"none"]}  >  { toggleFriendChat &&  ( info.friends.length > 0 ? <Friends info={info} friends={friends} handleOnlineFriend={handleOnlineFriend}  setToggle={setToggle}  handleOfflineFriend={handleOfflineFriend} /> : <Text mt={2}>No Friends Yet</Text>)
                                                                                                                      
} </Box> 

<Button ml={[ 0,2,2 ,2]}  mt={[2,0,0,0]} onClick={()=>{setToggleRoomChat((prev)=>!prev), setToggleFriendChat(false) , setToggleActiveMembers(false) , setToggleActiveRooms(false) }} bgColor={toggleRoomChat?"yellow":"white"} >My Room</Button>

{/* My rooms  and New Rooms section for mobile view */}

 <Box display={["block" , "none" , "none" ,"none"]}> {(toggleRoomChat &&  Object.keys(info).length !== 0) && <MyRooms info={info} group={group}  setGroup={setGroup}  joinRoom={joinRoom} setToggle={setToggle}  newRoom={newRoom}   setNewRoom={setNewRoom}  /> } </Box> 


<Button ml={[ 0,2,2 ,2]}  mt={[2,0,0,0]}  onClick={handleSpecialCase}
 bgColor={toggleActiveMembers?"yellow":"white"} >Online Users</Button>

{/* Online Users for mobile view */}
{/* {console.log(activeMembers)} */}
<Box display={["block" , "none" , "none" ,"none"]}> {(toggleActiveMembers && activeMembers.length-1 > 0 )? <OnlineUsers   setReceiverName={setReceiverName} toggleActiveMembers={toggleActiveMembers} activeMembers={activeMembers} info={info} friends={friends} setDm={setDm} setId={setId} setReceiver={setReceiver} getPreviousChats={getPreviousChats} setToggle={setToggle} /> : toggleActiveMembers ? <Box> <Text mt={2}>No Active Members</Text> </Box>:<>  </>
                                                                                                                       
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

 return <Box  key={el._id} ml={el.name==info.name?"50%":"0%"} justifySelf={"end"}  w={"50%"} padding={2} > <Box   w={[ "100%" , "70%" , "60%" ,"50%"]} bgColor={el.name==info.name?"green.300":"blue.200"} p={5} borderRadius={"20px"}  ><Text fontWeight={"bold"} > {el.name==info.name?"You":el.name}</Text> 
 {
 console.log(el.message) }
   {el.message.includes("cloudinary")?el.message.includes("pdf")? <iframe  src={el.message} width={"100%"} height="80%" frameborder="0"></iframe> :<Image src={el.message} alt="Image Deleted" />:<Text> {el.message}</Text>} </Box>  </Box>  
})}

  
</Box>:<Box h={"80vh"} overflow={"scroll"} > {data.length  >0 && data.map((el, ind)=>{
  
return  <Box key={el._id} ml={(el.name || el.senderName)==info.name?"50%":"0%"} justifySelf={"end"}  w={"50%"} padding={2} > <Box  w={[ "100%" , "70%" , "60%" ,"70%"]} bgColor={(el.name || el.senderName)==info.name?"green.300":"blue.200"} p={5} borderRadius={"20px"}  ><Text fontWeight={"bold"} fontSize={"20px"} > {(el.name || el.senderName)==info.name?"You":(el.name || el.senderName)}</Text> 
 {/* {
 console.log(el.message) } */}
{el.message.includes("cloudinary")?el.message.includes("pdf")? <iframe  src={el.message} width={"100%"} height="80%" frameborder="0"></iframe> :<Image src={el.message} alt="Image Deleted" />:<Text> {el.message}</Text>}</Box>  </Box>  
  })}</Box>}

{/* Message Box */} 

<Box backgroundColor={"yellow"} pos={"absolute"}  bottom={0} w={"100%"} p={2}  border={"1px solid black"} >
  <Flex  justifyContent={"space-evenly"}   > 
  <Input type="text" bgColor={"gray"} value={dm==true?text:message} cursor={"pointer"} backgroundColor={"white"} minW={"200px"} placeholder="enter message" w={"80%"}  onChange={(e)=> dm==true?setText(e.target.value):setMessage(e.target.value)} />
  {/* <form > */}
  {/* onSubmit={handleSubmit} */}
  <FormLabel  ml={"5px"} display= "inline-block" cursor= "pointer" p={"5px"} borderRadius={"5px"}  backgroundColor={file!==""?"green.200":"white"}   >
    {/* file */}
    <IoDocumentAttachOutline style={{ fontSize:"30px"}} />
    
  <Input id="file-input" type="file" accept=".pdf, .jpg, .jpeg, .png" onChange={handleFileChange} style={{ display: "none" }} />
</FormLabel>

  

    
      {/* <Button type="submit">Upload Resume</Button> */}
      {/* </form> */}
  <Button ml={["2px",5,5,5]} size={["sm","md" , "md" , "md"]} onClick={()=>dm==true?handleText(text):handleSubmit()}>{message!=="" || dm!==""?"Message":file!==""?"Upload":"Message"}</Button>
  </Flex>
</Box>

  </Box>


</Flex>


</Box>
  
  )
}

export default Home