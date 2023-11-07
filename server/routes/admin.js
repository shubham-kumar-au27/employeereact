const moment = require('moment');
const User = require('../models/user');
const  path = require('path');
const admin = require('../middleware/admin')
// const multer = require('multer');
const projectrouter = require('./project');
const passport = require('passport');
const profile = require('../models/profilepic')
const Projects = require('../models/project')
function adminRoute(app){
//admin -Get Register---
app.get('/admin', function (req, res, next) {
	return res.render('admin/adminregister.ejs');
	
});
// get admin panel route
app.get('/adminpanel',function (req, res, next) {
		profile.find({}).then((pics)=>{
			User.find({role:"employee"}).then((emp)=>{
				let val = emp;
				let picsMap = {};

				for (let j = 0; j < pics.length; j++) {
				picsMap[pics[j].uploadedBy] = pics[j].img;
				}

				for (let i = 0; i < val.length; i++) {
				if (picsMap.hasOwnProperty(val[i]._id)) {
					val[i].image = picsMap[val[i]._id];
				}
				}
				res.json(val)
				// return res.render('admin/adminpanel.ejs',{'value':val})

			}).catch(err => console.log(err))

		}).catch(err =>console.log(err))		
})
//Get Admin Controls---
app.get('/admincontrols',admin,function (req, res, next) {
	return res.render('admin/admincontrols.ejs')
})

//Get Add project----
app.get('/addproject',(req,res)=>{
	Projects.find().then(project => res.json(project)).catch(err => console.log(err))
})
//Register Login---------
app.post('/admin', function(req, res, next) {
	const personInfo = req.body;


	if(!personInfo.firstName || !personInfo.lastName || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({username:personInfo.username},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							c = data.unique_id + 1;
						}else{
							c=1;
						}
						var newPerson = new User({
							unique_id:c,
							firstName:personInfo.firstName,
							lastName:personInfo.lastName,
							username: personInfo.username,
							password: personInfo.password,
							role:"admin"
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"You are registered,You can login now."});
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});

app.get('/adminlogin', function (req, res, next) {

	return res.render('admin/adminlogin.ejs');
	

	
});
//post login admin----
app.post('/adminlogin',passport.authenticate('local'));
	
app.get('/adminprofile', function(req, res, next){

		User.findOne({unique_id:req.session.userId},function(err,data){
			// console.log("data");
			// console.log(data);
			if(!data){
				res.redirect('/admin');
			}else{
				//console.log("found");
				return res.render('admin/admindata.ejs', {"name":data.username,"email":data.email});
			}
		});
});

app.get('/adminlogout', function (req, res, next) {
	
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
			adminLogin = false
    		return res.redirect('/adminlogin');
    	}
    });
}
});
//forgot admin pswrd----
app.get('/adminforgetpass', function (req, res, next) {
	res.render("admin/adminforgetadminpass.ejs");
});

//employee register--------
app.get('/register',admin,(req,res)=>{
	res.render('employee/index.ejs')
})

//register-----
app.post('/',admin,function(req, res, next) {
	const  personInfo = req.body;
	// const person = req.files.awtar

	if(!personInfo.firstName || !personInfo.lastName || !personInfo.designation|| !personInfo.teamLeader  
		||!personInfo.date_of_birth || !personInfo.email || !personInfo.tl){
		res.send();
	} else {
		User.findOne({email:personInfo.email},function(err,data){
				if(!data){
					let dobpswrd = personInfo.date_of_birth.substring(5,7) + personInfo.date_of_birth.substring(8,10);
					//for Password-----
					let Password = personInfo.firstName.charAt(0).toUpperCase() + personInfo.lastName.charAt(0).toUpperCase()
					 + '@' + dobpswrd;
					//for userName----------
					let dob = personInfo.date_of_birth.substring(0,4);
					let userName;
						userName = personInfo.firstName.charAt(0).toUpperCase() + personInfo.firstName.substring(1,4) + dob
					var c; 

					User.findOne({username:personInfo.teamLeader}).then((leader)=>{
						const name = leader.firstName + leader.lastName


						User.findOne({},function(err,data){

							if (data) {
								c = data.unique_id + 1;
							}else{
								c=1;
							}
							var newPerson = new User({
								unique_id:c,
								firstName:personInfo.firstName,
								lastName:personInfo.lastName,
								designation: personInfo.designation,
								teamLeader:name,
								username: userName,
								tlusername:personInfo.teamLeader,
								date_of_birth:personInfo.date_of_birth,
								email:personInfo.email,
								password: Password,
								role:'employee',
								tl:personInfo.tl
												
							});
							newPerson.save().then(person => console.log(person)).catch(err => console.log(err));
						}).sort({_id: -1}).limit(1);
						res.send({"Success":"You are registered,You can login now."});

					}).catch(err => console.log(err))
					
				}else{
					res.send({"Failed":"Email is already used."});
				}

			});
	}

});
// Update a new idetified user by user id
app.put('/updateuser/:id',(req,res)=>{
	if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }
	const id = req.body._id;
    User.findByIdAndUpdate(_id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update user with ${id}. Maybe user not found!`})
            }else{
                // res.send(data)
				res.render("update_user", { user : userdata.data})
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update user information"})
        })

	

})	

// Delete a user with specified user id in the request
app.post('/deleteuser',(req,res)=>{
	console.log(req.body.Id)
	User.findByIdAndRemove(req.body.Id,(err)=>{
		if (err){
			// res.redirect('/adminpanel')
			res.send(err)
		}else{
			res.send('DELETED SUCCESSFULLY')
			// res.redirect('/adminpanel')
		}
	})
})
app.get('/getemptyprojects',(req,res)=>{
	Projects.find().then((project)=>{
		let length = project.length
		let empty = []
		// console.log(length)
		for (let i = 0;i < length;i++){
			if (project[i].task.length == 0){
				empty.push(project[i])
			}
		}
		console.log(empty)
		res.send('generated')
	}).catch(err => res.send(err))
})
}

module.exports = adminRoute;