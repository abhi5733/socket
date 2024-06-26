import { Box, Button, Flex , Text } from '@chakra-ui/react'
import React from 'react'

const OnlineUsers = ({toggleActiveMembers , activeMembers , info , friends , setDm , setId , setReceiver , getPreviousChats , setToggle ,  setReceiverName }) => {

  return <> {
    activeMembers.filter((el)=>{
  
        return el.data._id !== info._id  // removing  user's  own  information 
        }).filter((el)=> {const user =  info.friends.filter((ele)=>{   // searching for all the friends of user
         return el.data.name==ele.name
        }) ; if(user.length==0){
          console.log(user)
          return el
        }else{
         friends.push(el.data.name) // saving all active friends in friends array 
          return el
        }  }).map((el)=>{
        // console.log(el)
          return <Flex key={el._id} mt={2} alignItems={"center"}>
            <Text fontSize={20}>Name : {el.data.name}</Text>
          <Button ml={2} size={"xs"} bgColor={"green.200"}  onClick = {()=>{setDm(true) /*,setId(el.id) */     ,   setReceiverName(el.data.name),  setReceiver(el.data._id), getPreviousChats(el.data._id) , setToggle(true)}} >Message</Button>
          </Flex>
        })
     } </>
}

export default OnlineUsers