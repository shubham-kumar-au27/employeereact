const employee = require('../../models/user')
const taskreport = require('../../models/taskreport')
const fs = require("fs");
const imageModel = require('../../models/profilepic');

const path = require ('path')


// const { connect } = require('mongoose')

function fetchProjectReport(app){
    return {
        async submitProjectData(req,res){
            const reportData = await req.body
            // console.log(reportData)
            // let emp;
                // const unique = req.session.userId
                // console.log(unique)
                // if (unique){
                    employee.findOne({_id:req.user.id},(err,emp)=>{
                        if (err){
                            console.log(err)
                        }else{
                            // console.log(emp)
                            if (reportData){
                                console.log('teamleadinfo',req.user.teamLeader)
                               
                                    
                
                                new taskreport({
                                    projectName: reportData.projectName,
                                    task: reportData.task,
                                    timetaken: reportData.timetaken,
                                    teamleader: emp.teamLeader,  // must have error handling here
                                    assignedTo: emp.username,
                                    // date: dateNow
                                })
                                .save().then((generatedrep)=>{
                                    console.log(generatedrep)
                                    res.redirect('/userTask')

                                }).catch(err=>console.log(err))
                               
                                // console.log(taskReport)
                                
                            }
                        }
                    })
                // }

            // }
            

            

        },
        async getaddedTask(req,res){
            taskreport.find({},(err,reports)=>{
                if (err){
                    console.log(err)
                }else{
                    res.render('employee/userTask.ejs',{'reporttask':JSON.stringify(reports)})
                }
            })

        },
        //
        async submitTaskOnTable(req,res){
            let pending = req.body
            //if submitting the data from table-----
            employee.findOne({_id:req.user.id}).then((employee)=>{
                    //finds the reports matching the userName
                    taskreport.find({assignedTo: employee.username},(err,reports)=>{
                        if (err){
                            console.log(err)
                        }else{
                            let activeTasks = reports.filter((report)=>{
                                return report.taskStatus == 'pending'
                            })
                            activeTasks.forEach((task)=>{
                                taskreport.findOneAndUpdate({_id: task._id},{$set:{taskStatus:'submit'}},{new:true})
                                .then(doc =>console.log('task submitted successful')).catch(err =>console.log(err))          
                            })
                        }
                    })
            }).catch(err => console.log(err))
            
        
        },
        async deletprojectTask(req,res){
            taskreport.findByIdAndRemove(req.params.id,(err)=>{
                if (err){
                    res.redirect('/userTask')
                }else{
                    res.redirect('/userTask')
                }
            })
            

            
        },
        async postProfile(req,res){
            const data1 = req.body
            console.log(data1)
            employee.findOne({_id:data1.userid},(err,profilepic)=>{
                if(err){
                    console.log(err)
                }
                else{
                    console.log(profilepic)
                   const newImage= new imageModel({
                        img:{
                           data: fs.readFileSync("uploads/"+req.file.filename),
                           contentType:"image/png",
                        },
                        uploadedBy:profilepic.id,
                        username:profilepic.username
                        
                    })
                    console.log(newImage)
                    newImage.save()
                    
                    .then(()=>res.redirect('/adminpanel')).catch(error=>console.log(error))
                    // res.redirect('/adminpanel')
                    // res.send('success')
                   
                }
            })

       
        },
        async taskhistory(req,res){
            const username = req.body.username
            taskreport.find({
                assignedTo: {$in : username},
                date: {$gte: new Date((new Date().getTime() - (3 * 24 * 60 * 60 * 1000)))}
            }).then((result)=>{
                const history = result.filter((value)=>{

                    return value.taskStatus=='submit'

                })
                res.render('employee/taskdata.ejs',{'history':history})

            }).catch(err => console.log(err))
        }  
    }
}
module.exports = fetchProjectReport;