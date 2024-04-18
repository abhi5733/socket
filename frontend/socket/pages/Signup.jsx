import React, { useState } from 'react'
import {Link} from "react-router-dom"
import axios  from "axios"
import { Box , Button, FormLabel, Input, Text , useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import {useForm} from "react-hook-form"
import Loader from 'react-spinner-loader';

const Signup = () => {

  const { register, handleSubmit, formState: { errors }  } = useForm();
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate()
  const toast = useToast()
  const [state,setState] = useState({})


  const onSubmit = async (data)=>{
  
    setLoader(true)
    try{

    const data2 =  await axios.post(`${process.env.URL}/user/signup` , data)
    toast({
      title: 'User updated successfully',
      description: "We've created your account for you.",
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top'
    })
    setLoader(false)

    navigate("/login")
    console.log(data2)
    }catch(err){

      setLoader(false)
      err.response.status==400?toast({
        title: 'Something went wrong',
        description: "Please try again later",
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top'
      }) :
      toast({
        title: 'Username already Exist',
        description: "Please try with different Username",
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top'
      })
    
    }
  }



  return (
  
<Box  mt={5}  >

<Text fontSize={"30px"} textAlign={"center"} fontFamily={"cursive"}  >Signup</Text>
<Box width={["80%","400px","400px","400px"]} margin={"auto"} boxShadow='2xl' borderRadius={"10px"} mt={10} bgColor={"gray"}  > 
<form onSubmit={handleSubmit(onSubmit)} style={{ margin: "auto", padding: "10px" }}>
      <FormLabel fontWeight={"bold"} fontSize={[ "medium" , "medium" , "large" ,   "large"]}  color={"white"}  >Name</FormLabel>
      <Input
        {...register("name" , {
          required: {
            value : true,
            message : "This field is required*"
          } , 
          minLength:6,
        
        })}
        type='text'
        placeholder='Enter Name'
        style={{ width: "90%", padding: "3px" }}
        name="name"
        bgColor={"white"}
  
      />
    
      {errors.name &&   <Text color={"yellow"} >{errors.name.message}</Text>}
      {errors.name && errors.name.type === "minLength" && (
        <Text color={"yellow"}>Minimum length is 6 characters</Text>
      )}

      <FormLabel fontWeight={"bold"} fontSize={[ "medium" , "medium" , "large" ,   "large"]} color={"white"}  >Email</FormLabel>
      <Input
        type='email'
        placeholder='Enter Email'
        style={{ width: "90%", padding: "3px" }}
        name="email"
        bgColor={"white"}
        {...register("email" , {
          required: {
            value : true,
            message : "This field is required*"
          } , 
          pattern:{
            value : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/  ,
            message : "Please enter a valid email address"
          } 

        })}
   
      />
      {errors.email &&  
        <Text color={"yellow"}>{errors.email.message}</Text>}
      {errors.email && errors.email.type === "pattern" && (
  <Text>Please enter a valid email address</Text>
)}

      <FormLabel fontWeight={"bold"} fontSize={[ "medium" , "medium" , "large" ,   "large"]} color={"white"} >Password</FormLabel>
      <Input
        type='password'
        placeholder='Enter password'
       width= "90%"
        padding =  "3px"
        name="password"
        bgColor={"white"}
        {...register("password" , {
          required: {
            value : true,
            message : "This field is required*"
          } , 
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters long"
          },
          pattern: {
            value: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/,
            message: "Password must contain at least one number and one special character"
          }
        })}
      
      />
      {errors.password &&  <Text color={"yellow"}> {errors.password.message} </Text>  }

      <Button type='submit'  marginTop= "10px" backgroundColor= "white" color= "black"  _hover ={{backgroundColor:"yellow", color:"black"}} >Submit</Button >
      <Link to="/login" style={{ textDecoration: 'none' }}> 
        <Button ml={2} type="button" marginTop= "10px" backgroundColor= "white" color= "black"  _hover ={{backgroundColor:"yellow", color:"black"}}  >Login Directly</Button >
      </Link>
    </form>
</Box>

</Box>
  
  )
}

export default Signup