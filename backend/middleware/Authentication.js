
const jwt = require("jsonwebtoken")

const authentication = (req,res,next)=>{

    const token = req.headers.auth
console.log(req.body)
    if(token){
    const decoded = jwt.verify(token, 'masai');

    if(decoded){
      req.body.UserId =  decoded.UserId
        console.log(decoded)
       next()
    }else{
        res.status(404).send({"msg":"Something Went Wrong"})
    }
   

    }else{
        res.status(404).send({"msg":"Something Went Wrong"})
    }

}


module.exports = {authentication}