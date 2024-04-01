import { Box, Button, Flex , Text } from '@chakra-ui/react'
import React from 'react'

const Friends = ({info , friends , handleOnlineFriend , setToggle , handleOfflineFriend}) => {
  return <> {info.friends.map((el)=>{

return <Flex key={el.id} mt={2} alignItems={"center"} >
  <Text fontSize={20}  >Name : {el.name}</Text>
  {friends.includes(el.name)?<Button ml={2} size={"xs"} onClick={()=>{handleOnlineFriend(el.name), setToggle(true)}} >On-line</Button>:<Button  ml={2} size={"xs"}  onClick={()=>{handleOfflineFriend(el.id) , setToggle(true)}} >Message</Button>}
  
</Flex>
}) }
</>
  

}

export default Friends