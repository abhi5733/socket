import axios from 'axios'
import React, { useState } from 'react'
import {Link , useNavigate} from "react-router-dom"
import { Box, useToast  , Text, FormLabel, Button, Input, border} from '@chakra-ui/react'
import Loader from 'react-spinner-loader';
// import 'dotenv/config'
// require('dotenv').config()
const Login = () => {

  const toast = useToast()
  const [loader, setLoader] = useState(false);
    const [state,setState] = useState({})
const navigate = useNavigate()
    const handleChange = (e)=>{
  
      const {name,value} = e.target
      
      setState((prev)=>( {...prev , [name]:value}) )
  
    } 

    const handleSubmit = async (e)=>{
        e.preventDefault()
        setLoader(true)
        try{

        const data =  await axios.post(`${process.env.URL}/user/login` , state)  
        localStorage.setItem("token" , data.data.token)  
        toast({
          title: 'logged-in successfully',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top'
        })
        setLoader(false)
        // alert("user logged-in succes
        navigate("/home") 
        
        }catch(err){
            console.log(err)
            toast({
              title: 'Something went wrong',
              description: "Please try again later",
              status: 'error',
              duration: 2000,
              isClosable: true,
              position: 'top'
            })
            setLoader(false)
        }
      }

  return (
  
    <Box>
      <Box pos={"absolute"} left={"50%"} right={"50%"} top={"50%"} zIndex={100}   > 
 <Loader show = {loader}/>
 </Box>
    <Text fontSize={"30px"} textAlign={"center"} fontFamily={"cursive"} mt={"20px"}>Login</Text>
   
<Box width={["80%","400px","400px","400px"]} margin={"auto"} boxShadow='2xl' borderRadius={"10px"} mt={10} bgColor={"gray"} p={2} > 
<form  onSubmit={handleSubmit} >

<FormLabel fontWeight={"bold"} fontSize={[ "medium" , "medium" , "large" ,   "large"]}  color={"white"}>UserName</FormLabel>
<Input   bgColor={"white"}   type='text' placeholder='Enter UserName'  width= "90%"  padding={"3px"}  value={state.name} name="name"  onChange={handleChange} /> <br/>
<FormLabel mt={2} fontWeight={"bold"} fontSize={[ "medium" , "medium" , "large" ,   "large"]}  color={"white"}>Password</FormLabel> 
<Input   bgColor={"white"} type='password' placeholder='Enter password'  style={{width:"90%" ,  padding:"0 2px"}}  value={state.password} name="password"  onChange={handleChange} />
<Button type='submit' mt={2} backgroundColor= "white" color= "black"  _hover ={{backgroundColor:"yellow", color:"black"}}  >Submit</Button>
 <Link to="/" ><Button  mt={2} ml={5} backgroundColor= "white" color= "black"  _hover ={{backgroundColor:"yellow", color:"black"}}  >Sign up</Button> </Link>
</form>

</Box>
</Box>
    
  )
}

export default Login