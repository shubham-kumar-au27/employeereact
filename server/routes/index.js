const User = require('../models/user');
const multer=require('multer');
// let alert = require('alert')
const passport = require('passport')
const project= require('../models/project')
const fetchprojectData = require('../controllers/employee/task')
const userAuth = require('../middleware/user')
const teamleadercontroller = require('../controllers/employee/teamleadcontroller')
const sessionStore = require('express-session').sessionStore; // Get the session store

function userRoute(app){

//get login
app.get('/', function (req, res, next) {
	return res.render('employee/login.ejs');

});
// app.get('/teamreports',(req,res)=>{
// 	return res.render('employee/teamsreport')
// })
//get user task
// app.get('/userTask',fetchprojectData().findProjects)

app.get('/userTask',userAuth,fetchprojectData().getprojects)


//get user
app.get('/login', function (req, res, next) {

	return res.render('employee/login.ejs');
	
});
//post login
app.post('/login',passport.authenticate('local'),(req,res)=>{
	res.send(req.user)
	
		// User.findOneAndUpdate({_id:req.user.id},{$set:{lastLogin:Date.now()}},(err,success)=>{
        //     if (err){
        //         console.log(err)
        //     }else{
                
        //         console.log(success)
        //     }
        // })
});
//get profile--
app.get('/profile',userAuth,function (req, res, next) {
		User.findOne({_id:req.user.id},function(err,data){
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			return res.redirect('/userTask');
		}
	});	
});
//get Logout---
app.get('/logout',userAuth,function (req, res, next){
		let pendingTask = req.session.pending

		if (pendingTask  > 0){
			
			res.redirect('/userTask')
		}else{
			req.session.destroy(function (err){
				if (err) {
					return next(err);
				} else {
					return res.redirect('/');
				}
			});
	}
});

app.get('/getteamleads',teamleadercontroller().getallteamleads)

app.get('/teamreports',userAuth,teamleadercontroller().getteamReports)
app.get('/reports',userAuth,(req,res)=>{
	res.render('employee/teamsreport')
})
app.get('/reportsbydate',userAuth,teamleadercontroller().reportsByDate)
// app.get('/projectList')
app.get('/downloademployee',teamleadercontroller().downloademployees)

}


module.exports = userRoute;

