import { Box, Button, Flex, Input , Text } from '@chakra-ui/react'
import React, { useState } from 'react'

const MyRooms = ({info , setGroup , joinRoom , setToggle , newRoom ,  setNewRoom , group}) => {

  const[room,setRoom] = useState("") // for maintaining the room name

   return <>  {
        info.rooms.length>0?<Box> {info.rooms.map((el)=>{
   
          return  <Box key={el._id} >  <Flex mt={2} alignItems={"center"} >
            <Text fontSize={20}>RoomName : {el.roomName}</Text>
          <Button ml={2} size={"xs"} onClick={()=>{setToggle(true) ,setGroup(el.roomName),joinRoom(el.roomName)}}>Join</Button>
          </Flex>
      </Box> 
        }) }
        
       {newRoom &&  <Box mt={5}>
        <Input type='text'  color="gray" bgColor={"white"} placeholder='Enter Room Name'  value={room} w={[ "80%" , "80%" , "50%" ,  "50%"]} onChange={(e)=>{setRoom(e.target.value),setGroup(e.target.value)}} /> <br></br>
        <Flex mt={5} w={"20%"} justifyContent={"space-between"}  > 
        <Button size={["sm","xs","xs","xs"]} onClick={()=>{joinRoom(room);setToggle((prev)=>!prev);setRoom("")}} >Join</Button>
        <Button size={["sm","xs","xs","xs"]} ml={[2,0,0,0]} onClick={()=>setNewRoom(false)} >Back</Button>
        </Flex>
      </Box>  }
         { !newRoom && <Button  size={"xs"} mt={5}  onClick={()=> setNewRoom(true)} >Join New Room</Button> }
      
        </Box>:<Box>
          <Text>You are not part of any room </Text>
          {newRoom &&  <Box mt={5}>
        <Input type='text'  color="gray" bgColor={"white"} placeholder='Enter Room Name'  value={room} w={"50%"} onChange={(e)=>{setRoom(e.target.value),setGroup(e.target.value)}} /> <br></br>
        <Flex mt={5} w={"20%"} justifyContent={"space-between"}  > 
        <Button size={["sm","xs","xs","xs"]} onClick={()=>{joinRoom(room);setToggle((prev)=>!prev);setRoom("")}} >Join</Button>
        <Button size={["sm","xs","xs","xs"]} ml={[2,0,0,0]} onClick={()=>setNewRoom(false)} >Back</Button>
        </Flex>
      </Box>  }
          { !newRoom && <Button  size={"xs"} mt={5}  onClick={()=> setNewRoom(true)} >Join  Room</Button> }
        </Box>
      } </> 


}

export default MyRooms