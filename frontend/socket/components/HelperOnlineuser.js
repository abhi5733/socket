

  
  const HelperOnlineuser = ({activeMembers , info , friends}) => {
    
        {activeMembers.length-1>0 && activeMembers.forEach((el)=>{
            if(el.data._id !== info._id){ // removing  user's  own  information 
              {const user =  info.friends.filter((ele)=>{   // searching for all the friends of user
                return el.data.name==ele.name
               }) ; if(user.length==0){
                
               }else{
                friends.push(el.data.name) // saving all active friends in friends array 
                
               }  }
            } 
            
          }) }
    
  }
  
  export default HelperOnlineuser