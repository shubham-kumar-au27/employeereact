const adminRoute = require("../../routes/admin");
const taskreport = require('../../models/taskreport');
const imageModel = require('../../models/profilepic');
const TaskSchema = require('../../models/taskschema');
const projects = require('../../models/project');
const employees = require('../../models/user')
const flash = require('connect-flash')

// const moment = require('moment')
//  data fetch from project scheema and user schema 
function fetchprojectData(){
	return{
        async getprojects(req,res){
            let items=null
            imageModel.findOne({uploadedBy:req.user.id}).then(profile=>{
                if(profile){
                    items = profile
                }
            }).catch(err => console.log(err))
            //this will find/fetch all the tasks assigned to this user----
            TaskSchema.find({assignedTo:req.user.username}).then((taskSchema)=>{
                //do something with taskschema-----
                //this will fetch  all the tasks selected by the employee---
                taskreport.find({assignedTo:req.user.username,taskStatus:"pending"}).then((myTask)=>{  
                    // do something with mytask---
                    console.log(myTask)
                    let pendinglength = myTask.length
                    req.session.pending = pendinglength
                    const Data = req.user
                imageModel.findOne({uploadedBy:req.user.id}).then(profile=>{
                
                res.render('employee/userTask.ejs',{'projects':taskSchema, 'Data':Data,
                'pendingTask':myTask, 
                'pendinglength': JSON.stringify(pendinglength),'items':profile})

                }).catch(err => console.log(err))
                
                }).catch(err => console.log(err))
                

            }).catch(err => console.log(err))
        },
      
        async deleteProject(req,res){

            projects.deleteOne(
                { projectName: req.body.projectName }
                )
                .then(result => {
                    res.send(`Deleted project successfuly`)
                })
                .catch(error => console.error(error))
        },
        async findProjectById(req,res){

            await projects.findById({_id:req.params.id}).then(data => res.send(data)).catch(err => console.log(err))
        },
        //assigned Task----
        async getallEmployees(req,res){
            // if (req.user?.role == "admin"){
                projects.find().then((PROJECTS)=>{
                    employees.find({role:"employee"}).then((Employees)=>{
                        TaskSchema.find().then((assignedTask)=>{
                            const assignTaskData = []
                            assignTaskData.push(PROJECTS)
                            assignTaskData.push(Employees)
                            assignTaskData.push(assignedTask)
                            res.json(assignTaskData)
                        }).catch(err => console.log(err))
                    }).catch(err =>console.log(err))
                }).catch(err => console.log(err))
            // }

        },
        async assignedTask(req,res){
            const projectId = await projects.findById({_id:req.params.id},(err,data)=>{
                if (err){
                    console.log(err)
                }else{
                    res.send(projectId)
                    console.log(projectId)
                }
            })
        },
        //add task in project-----
        async updateProject(req,res){
            console.log('updateproject is called....')
            const getProject = req.body.projectName
            const tasks = req.body.Task

            // Remove any null values from the task array
            tasks.filter(task => task !== null);

            console.log('project',getProject)
            console.log('tasks',tasks)
                    updated = projects.updateOne(
                            {projectName:getProject},
                            { $addToSet: { task: { $each: tasks } } },
                        ).then((updatedres)=>{
                            console.log(updatedres)
                            res.send('updated successfully')
                        }).catch(err => res.send(err))
        },
       //employee task Updates------
       async assigntask(req,res){
        const assign = req.body
        // console.log(assign)
        let emp = assign.employee
        // console.log(typeof(emp))
            // console.log(typeof(emp))

    const chcktyp = typeof(emp)

    // console.log(chcktyp)
    if (chcktyp == 'object'){
        console.log('yes')
         //for finding if task is assigned to the user or not
         for (let i = 0; i < emp.length;i++){
            TaskSchema.findOne(
                {
                    projectName:{$in : assign.projectName},
                    assignedTo:{$in:emp[i]},
                },(err,success)=>{
                    if (success){
                        console.log('project already assigned')
                        projects.findOne({projectName:assign.projectName},(err,pro)=>{
                            if(err){
                                console.log(err)
                            }else{
                                TaskSchema.updateOne(
                                    {
                                        projectName:{$in: success.projectName},
                                        assignedTo:{$in: success.assignedTo}
                                    },
                                    {task:pro.task}
                                ).then((updated)=>{
                                    res.send(`${updated} projectName${projectName}`)
                                    console.log('updated successfully')
                                })
                            }
                        })
                    }else{
                        projects.findOne({projectName:assign.projectName},(err,data)=>{
                            if (err){
                                console.log(err)
                                // res.send(err)
                            }else{
                                const assign = new TaskSchema({
                                    projectName:data.projectName,
                                    task: data.task,
                                    assignedTo: emp[i],
                                    taskStatus:'active'
                                })
                                assign.save((err,success)=>{
                                    if (err){
                                        res.send(err)
                                        console.log(err)
                                    }
                                    else{
                                        console.log(success)
                                        res.send(success)
                                    }
                                })

                            }
                        })
                    }
                }

            )
        }
    }else{
         //for finding if task is assigned to the user or not
            TaskSchema.findOne(
                {
                    projectName:{$in : assign.projectName},
                    assignedTo:{$in:emp},
                },(err,success)=>{
                    if (success){
                        // req.flash('error_msg','project already assigned')
                        projects.findOne({projectName:assign.projectName},(err,pro)=>{
                            if(err){
                                console.log(err)
                            }else{
                                TaskSchema.updateOne(
                                    {
                                        projectName:{$in: success.projectName},
                                        assignedTo:{$in: success.assignedTo}
                                    },
                                    {task:pro.task}
                                ).then((resp)=>{
                                    res.send(resp)
                                    console.log('updated successfully...')
                                })
                            }
                        })
                    }else{
                        projects.findOne({projectName:assign.projectName},(err,data)=>{
                            if (err){
                                console.log(err)
                            }else{
                                const assign = new TaskSchema({
                                    projectName:data.projectName,
                                    task: data.task,
                                    assignedTo: emp,
                                    taskStatus:'active'
                                })
                                assign.save((err,success)=>{
                                    if (err){
                                        console.log(err)
                                        res.send(err)
                                    }
                                    else{
                                        res.send(success)
                                        console.log(success)
                                    }
                                })

                            }
                        })
                    }
                }

            ) 
    }

},
        async sessionsave(req,res){
            let assignTask = req.body
            if (assignTask){
                console.log(assignTask)
                let curTask = {
                    projectName: req.body.projectName,
                    task: req.body.task,
                    timetaken: req.body.timetaken
                }
        
                req.session.assignedTask = curTask
                // res.redirect('/userTask')
                return res.json({task: req.session.assignedTask})
            }
          
},
        async deleteSessionTask(req,res){
    let curTask = req.body

    console.log(curTask)

    },
// async userLogout(req,res){
//    console.log(pendinglength)
//     // if (pendinglength == 0){
//         res.redirect('/')
//     // }else{
//     //     res.send('please submit your task before logging out')
//     // }
// }
    }      
}
module.exports= fetchprojectData;