import { Box , Text , Flex } from '@chakra-ui/react'
import React from 'react'

const Navbar = () => {
  return (
  <Box>
   <Flex h={"10vh"} p={5} alignItems={"center"} bgColor="yellow" ><Text fontSize={"30px"} fontFamily={"cursive"} >AbhiChat</Text></Flex>

  </Box>
  )
}

export default Navbar