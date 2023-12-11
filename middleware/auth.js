const jwt = require('jsonwebtoken');
const User = require('../models/user-model');

const authenticate = async(req, res, next)=>{
    try{
        console.log(req.header('authorization'));
        const token = req.header('authorization');
        
        console.log(token);
        if(!token) return res.status(401).json({success:false, message:'Token Missing'});
        const decodedUser = jwt.verify(token, 'secretKey');
        const userid = decodedUser.userId;
      // console.log('userId>>>>>', user.userId);
        const user =  await User.findOne({where: {id: userid}, attributes: {exclude: ['password']}});
            req.user = user;
            console.log(req.user, user);
            next();

    }catch (err){
        console.log(">>>>>>>>>>>>>>>",err);
        return res.status(401).json({success:false});
    }
}



module.exports = {
    authenticate,
};

// const authenticate = async (req, res, next) => {
//     try {
//       const token = req.header('Authorization'); // Get the token from the request header
  
//       if (!token) return res.status(401).json({ success: false, message: 'Token Missing' });
  
//       const decodedUser = jwt.verify(token, 'secretKey'); // Verify the token using your secret key
//       const userId = decodedUser.userId; // Extract the user ID from the decoded token
  
//       const user = await User.findById(userId); // Fetch the user from the database based on the ID
  
//       if (!user) return res.status(401).json({ success: false, message: 'User not found' });
  
//       req.user = user; // Attach the user object to the request for future use in subsequent middleware or routes
//       next();
//     } catch (err) {
//       console.log("Error:", err);
//       return res.status(401).json({ success: false, message: 'Authentication Failed' });
//     }
//   };
  
//   module.exports = {
//     authenticate
//   };
  