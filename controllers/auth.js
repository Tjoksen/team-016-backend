const User= require("../models/user");
const {errorHandler} =require("../helpers/dbErrorHandler");
const jwt =require("jsonwebtoken");//to generate a signed token 
const expressJwt =require("express-jwt");//to check authorization



exports.signUp =(req,res)=>{
    console.log("req.body",req.body);
   const user=new User(req.body);
   user.save((err,user)=>{
            if(err){
                return res.status(400).json( {
                        err :errorHandler(err)
                    } );
            }

            user.salt=undefined;
            user.hashed_password=undefined;
             res.json({
                user
            });
   });

};


exports.signIn =(req,res)=>{
//find the user based on email
const {email,password}=req.body;
User.findOne({email},(err,user)=>{
    if(err || !user){
        return res.status(400).json({
            error:"User with these credentials does not exist!Please sign up"
        })

    }
    //if user is found make sure the email and password match 
    //create and use authenticate method in UserSchema
    if(!user.authenticate(password)){
        return res.status(401).json({
            error:"Email and password does not match !"
        })
    }

    //generate a signed token with user id and secret 
    const token=jwt.sign({_id:user._id},process.env.JWT_SECRET)
    //persist the token as "t" in cookie with expiry date
    res.cookie("t",token,{expiry :new Date() + 9999});
    //return the response user and token to frontend client

    const {_id,name,email,role}=user;
    return res.json({token,user:{_id,email,name,role}})
});

}

exports.signOut=(req,res)=>{
    res.clearCookie("t");
    res.json({message :"You are now signed out!"  });
}

exports.requireSignin=expressJwt({
    secret:process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty:"auth"
}); 

exports.isAuth=(req,res,next)=>{
    let user=req.profile && req.auth && req.profile._id ==req.auth._id
     if(!user){
         return res.status(403).json({
            error :errorHandler(error)
         });
     }
     next();
}

exports.isAdmin=(req,res,next)=>{
    if(req.profile.role === 0){
        return res.status(403).json({
                 error:"Insufficient privillegdes !You are not Admin"
        });
    }
    next();

}