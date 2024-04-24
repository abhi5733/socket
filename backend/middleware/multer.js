const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
   
    destination: function (req, file, cb) {
      // console.log(file)
        console.log(2)
      cb(null, './uploads'); // Set the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
       
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate unique filename
    }
    
  });

 const upload = multer({ storage});
 
 module.exports = {upload} 