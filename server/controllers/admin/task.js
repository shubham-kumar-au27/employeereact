 const taskschema =require('../../models/taskschema')
 const Project = require("../../models/project")
 const taskReport = require('../../models/taskreport')
 const employee = require('../../models/user')
 const Excel = require('exceljs')
function admincontroller(app){
    return{
        // async fetchtaskDetails(req,res){
        //     const page = parseInt(req.query.page) || 1; // Get the current page number from the query parameters
        //     const limit = 10; // Number of records to display per page

        //     try {
        //         if (req.query.search) {
        //         // Search functionality
        //         const searchQuery = req.query.search;
        //         const regex = new RegExp(searchQuery, 'i');

        //         const count = await taskReport.countDocuments({
        //             $or: [
        //               { projectName: regex },
        //               { teamleader: regex },
        //               { assignedTo: regex },
        //               {teamleader:regex},
        //               {task:regex}
        //             ]
        //           }); // Count total number of matching documents // Count total number of matching documents
        //         const totalPages = Math.ceil(count / limit); // Calculate total number of pages

        //         const skip = (page - 1) * limit; // Calculate the number of documents to skip

        //         const report = await taskReport.find({
        //             $or: [
        //               { projectName: regex },
        //               { teamleader: regex },
        //               { assignedTo: regex },
        //               {teamleader:regex},
        //               {task:regex}
        //             ]
        //           })
        //             .skip(skip)
        //             .limit(limit);

        //         res.render('admin/taskdetails.ejs', {
        //             taskreport: report,
        //             currentPage: page,
        //             totalPages: totalPages,
        //             // searchQuery: searchQuery
        //         });
        //         } else if (req.query.startDate && req.query.endDate) {
        //         // Date range search functionality
        //         const startDate = req.query.startDate;
        //         const endDate = req.query.endDate;

        //         const count = await taskReport.countDocuments({ date: { $gte: startDate, $lte: endDate } }); // Count total number of matching documents
        //         const totalPages = Math.ceil(count / limit); // Calculate total number of pages

        //         const skip = (page - 1) * limit; // Calculate the number of documents to skip

        //         const report = await taskReport.find({ date: { $gte: startDate, $lte: endDate } })
        //             .skip(skip)
        //             .limit(limit);

        //         res.render('admin/taskdetails.ejs', {
        //             taskreport: report,
        //             currentPage: page,
        //             totalPages: totalPages
        //         });
        //         } else if (req.query.download === 'true') {
        //             // Download all data as Excel
        //             const report = await taskReport.find({}, 'date assignedTo projectName task timetaken teamleader'); // Fetch only the desired fields
              
        //             // Modify report object to match desired field names
        //             const modifiedReport = report.map((item) => {
        //               return {
        //                 'DATE': item.date,
        //                 'USER NAME': item.assignedTo,
        //                 'PROJECT NAME': item.projectName,
        //                 'TASK': item.task,
        //                 'TIME TAKEN': item.timetaken,
        //                 'TEAM LEADER': item.teamleader
        //               };
        //             });
              
        //             const workbook = xlsx.utils.book_new();
        //             const worksheet = xlsx.utils.json_to_sheet(modifiedReport);
        //             xlsx.utils.book_append_sheet(workbook, worksheet, 'Task Report');
        //             const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        //             res.setHeader('Content-Disposition', 'attachment; filename=task_report.xlsx');
        //             res.type('application/octet-stream');
        //             res.send(excelBuffer);
        //           } else {
        //         // Pagination without search or date range
        //         const count = await taskReport.countDocuments({}); // Count total number of documents
        //         const totalPages = Math.ceil(count / limit); // Calculate total number of pages

        //         const skip = (page - 1) * limit; // Calculate the number of documents to skip

        //         const report = await taskReport.find({})
        //             .skip(skip)
        //             .limit(limit);

        //         res.render('admin/taskdetails.ejs', {
        //             taskreport: report,
        //             currentPage: page,
        //             totalPages: totalPages
        //         });
        //         }
        //     } catch (err) {
        //         console.log(err);
        //         res.status(500).send('Internal Server Error');
        //     }

        // },
    
        // async rendertaskdetailsPage(req,res){
        //     taskReport.find().then(report => res.render('admin/taskdetails.ejs',{'taskreport':report})  ).catch(err => res.send(err))
        // },
        async fetchtaskDetails(req,res){
            taskReport.find().then(report => res.send(report)).catch(err => res.send(err))
        },
        async deleteaddedTask(req,res){
            console.log( req.body.projectId,req.body.taskName)
            const projectname = req.body.projectId
            const  taskToDelete = req.body.taskName
            Project.findOneAndUpdate(
                { _id: projectname },
                { $pull: { task: taskToDelete } },
                { new: true } // Setting { new: true } returns the updated document
              )
                .then((updatedProject) => {
                  if (updatedProject) {
                    console.log(`Task "${taskToDelete}" deleted from project "${projectname}"`);
                    res.send("Task deleted Successfully")
                  } else{
                    console.log(`Project "${projectname}" not found.`);
                  }
                })
                .catch((error) => {
                  console.error('Error deleting task:', error);
                });

            
                
        },
        async deleteAssignedTask(req,res){

            await taskschema.deleteOne(
                {_id:req.body.projectid}

            ).then(result=>{
                console.log(result,'project deleted successfully')
                // res.redirect('/addproject/project')
                res.send(`${req.body.projectid} project was deleted successfully`)
            }).catch(err => console.log(err))
            
            // taskschema.update(
            //     {_id : {$in : req.body.projectid},
            //     task:{$in : req.body.taskName},
            //     assignedTo:{$in:req.body.assignedTo}
            //     },
            //     {$pull:{task:req.body.taskName}},
            //     function(err,success){
            //         if (err){
            //             console.log(err)
            //             res.redirect('/addproject/project')
            //         }else{
            //             res.redirect('/addproject/project')
            //         }
            //     }
            //     )
        },
        async updateTaskname(req,res){
            project.update(
                { projectName: req.body.projectName }, 
                { $pull: { task: req.body.taskName } },
                function(err,success){
                    if (err){
                        res.send(err)
                    }else{
                        res.redirect('/addproject')
                    }
                }
                // false, // Upsert
                // true, // Multi
            )
        },
        async updateAssignedTask(req,res){
            project.update(
                {
                    _id:{$in:req.body.projectid},
                    task:{$in:req.body.taskName}
                },
                {$pull:{task:req.body.taskName}},(err,success)=>{
                    if (err){
                        console.log(err)
                    }else{
                        project.updateOne(
                            {
                                _id:req.body.projectid
                            },
                            {$addToSet:{task:req.body.updatedName}},(err,result)=>{
                                if (result){
                                    return res.redirect('/addproject')
                                }else{
                                    // console.log(result)
                                    return res.redirect('/addproject')
                                    // res.send('Task Updated Successfully')
                                }
                            }
                        )
                    }

                }
            )
        },
        async deleteSubmitedtask(req,res){
            const startDate = req.body.start
            const endDate = req.body.end
            taskReport.deleteMany({ date: { $gte: startDate, $lte: endDate } },(err,result)=>{
                if (err){
                    res.send(err)
                }else{
                    res.send(`task deleted successfully`)
                }
            })
        },
        async EditEmployee(req,res){
            const employeeId = req.body.employeeid
            const designation = req.body
            // console.log(designation)

            employee.findByIdAndUpdate(employeeId,designation,{new:true},(err,doc)=>{
                if (err){
                    console.log(err)
                    res.status(500).send('Error Updating Data')
                }else{
                    console.log(doc)
                    res.redirect('/adminpanel')
                }
            })
        },
        async downloadEmployee(req,res){
            

            employee.find().then((data)=>{
                // res.send(data)
            const workbook = new Excel.Workbook();
            const worksheet = workbook.addWorksheet('Test Results');

            // Add header row
            worksheet.addRow(["FirstName","lastName","designation","teamLeader","userName","dob"]);

            data.forEach(item => {
                worksheet.addRow([
                  item.firstName,
                  item.lastName,
                  item.designation,
                  item.teamLeader,
                  item.username,
                  item.dob
                ]);
              });
                    // Save workbook
        const fileName = 'registeredcandidates.xlsx';
        workbook.xlsx.writeFile(fileName)
        .then(() => {
            console.log(data)
            console.log(`${fileName} has been created successfully.`);
            // Download file
            const file = fs.createReadStream(fileName);
            const stat = fs.statSync(fileName);
            res.setHeader('Content-Length', stat.size);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
            file.pipe(res);
        })
    }).catch(err => res.send(err))
        },
    }
}



module.exports = admincontroller
    
    