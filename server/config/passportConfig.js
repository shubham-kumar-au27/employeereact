const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user')
// const date = require('date-and-time')
const moment = require('moment')

exports.initializingPassport = (passport)=>{
    passport.use(
        new LocalStrategy( async(username,password,done)=>{
       
        try{
            const user = await User.findOne({username})
            if (!user) return done(null,false);


        if (user.password !== password){
            return done(null,false);

        }else{
            // let curdate = Date.now()
          

            User.findOneAndUpdate({_id:user.id},{$set:{lastLogin:moment().utcOffset("+05:30").format()}},(err,success)=>{
                if (err){
                    console.log(err)
                }else{
                    
                    console.log(success)
                }
            })
    
            console.log(user)
            return done (null, user)

        }

      

        }
         catch (error){
            return done(error, false)
        }
        
    }))
    passport.serializeUser((user,done)=>{
        done(null,user.id)
    });
    passport.deserializeUser(async(id,done)=>{
        try{
            const user = await User.findById(id);
            
            done(null, user);
        }catch (error){
            done (error,false)
        }
    })
};

// exports.isAuthenticated = (req,res,next) => {
//     if (req.isAuthenticated()) return next()
//     res.redirect('/adminlogin');
// }



