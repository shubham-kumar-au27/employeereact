const project = require('../models/project');
const user = require('../models/user');
const admincontroller = require('../controllers/admin/task')
const taskSchema = require('../models/taskschema')
const taskreport = require('../models/taskreport')
require('./admin')
const multer = require('multer')
const admin = require('../middleware/admin')
const userAuth = require('../middleware/user')
// const {isAuthenticated} = require('../config/passportConfig')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    cb(null,'./uploads')  
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname )
  }
})

var upload = multer({ storage: storage })



const fetchprojectData = require('../controllers/employee/task');
const fetchProjectReport = require('../controllers/employee/reportcontroller');

function projectrouter(app){
    app.post('/project',async (req,res)=>{
      console.log(req.body.projectName)
      console.log(req.body.task)
        const data = new project({
            projectName:req.body.projectName,
            task:req.body.task
        })
         await data.save().then(
          res.send('Project added successfully..')

         ).catch(err => res.send(err))
       
    })
    //for deleting project------
    app.delete('/deleteproject',fetchprojectData().deleteProject);

    //for deleting task from master project-------Add project.ejs
    app.post('/deleteTask',admincontroller().deleteaddedTask)
    //getting project by id--
    app.get('/project/:id',admin,fetchprojectData().findProjectById);
    app.get('/addproject/project/',fetchprojectData().getallEmployees);
    //for adding tasks in already created project------->>>>>>>>
    app.post('/addtask',fetchprojectData().updateProject);
    app.get('/assignedtask',admin,fetchprojectData().assignedTask);
    app.post('/assignproject',fetchprojectData().assigntask);        //assigning task  to employees
    app.post('/usersession',fetchprojectData().sessionsave)//storing data into session Storage----
    // app.delete('/userTask',fetchprojectData().deleteSessionTask) //deleting task from user's session---


    //task updates from the user's side----
    app.post('/submittask',userAuth, fetchProjectReport().submitProjectData) //posting projectData from employee's side---
    //admin-- get all task by employee--
    // app.get('/fetchtask',admin,admincontroller().fetchtaskDetails)
    //render taskdetailspage-----
    app.get('/taskdetails',admincontroller().fetchtaskDetails)

    //active to submit
    app.put('/userTask',userAuth,fetchProjectReport().submitTaskOnTable) //testing

    // delete submited task and project
    app.delete('/userTask/:id',userAuth,fetchProjectReport().deletprojectTask)
    //for uploading-------
    app.post("/userTask/uploadphoto",upload.single('myImage'),fetchProjectReport().postProfile)

    // get user task data
  

    app.post('/taskHistory',userAuth,fetchProjectReport().taskhistory)

    app.post('/deleteAssignProject',admincontroller().deleteAssignedTask)
    //deleting multiple assigned projects----
    // app.delete('/deleteselected',admincontroller().deleteSelected)
//for updating taskName---
  app.post('/addproject',admin,admincontroller().updateAssignedTask)

  app.delete('/deletesubmittedtask',admincontroller().deleteSubmitedtask)

  app.post('/editemployee',admincontroller().EditEmployee)
  app.post('/downloaddata',admincontroller().downloadEmployee)
}


module.exports = projectrouter
