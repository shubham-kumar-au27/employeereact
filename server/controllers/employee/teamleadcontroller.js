const employee = require('../../models/user')
const tasks = require('../../models/taskreport')
const ExcelJS = require('exceljs')
function teamLeadController(){
    return{
        async downloademployees(req,res){
            employee.find({}).then((results)=>{
                console.log(results.length)
                    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Add headers to the worksheet
    worksheet.addRow(['firstName', 'lastName', 'designation','teamLeader','username','dob','email','password']);

    // Add data rows to the worksheet
    results.forEach((row) => {
      worksheet.addRow([row.firstName,row.lastName,row.designation,row.teamLeader,row.username,row.date_of_birth,row.email,row.password]);
    });

    // Set the response headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');

    // Send the workbook as a response
    workbook.xlsx.write(res)
      .then(() => {
        res.end();
      })
      .catch((writeError) => {
        console.error('Error writing workbook:', writeError);
        return res.status(500).send('Error generating Excel file');
      });
  
// res.send(report)
}).catch(err => res.send(err))

        },
        async getallteamleads(req,res){
        
            employee.find({tl:"yes"}).then((leads)=>res.send(leads)).catch(err => res.send(err))

        },
        // Collection2Model.find({ name: "someName" }, (err, collection2Docs) => {
        //     if (err) {
        //       console.log(err);
        //     } else {
        //       const ages = collection2Docs.map((doc) => doc.age); // Extract all ages from the documents in collection2
        //       Collection1Model.find({ age: { $in: ages } }, (err, collection1Docs) => {
        //         if (err) {
        //           console.log(err);
        //         } else {
        //           console.log(collection1Docs);
        //         }
        //       });
        //     }
        //   });
          
        async getteamReports(req,res){
            const projectName = req.query.projectName
            const username = req.query.username
            const date = req.query.date
            const task = req.query.task
            // console.log(username)
            employee.find({tlusername:req.user.username}).then((reports)=>{
                const result = reports.map((doc => doc.username)) //will extract all usernames frm the docs in employee--

                
                if (projectName && username && date && task){
                    const requestedDate = date
                    const startDate = new Date(requestedDate);
                    const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000); // Adding one day to include the entire day

                    tasks.find({ assignedTo: { $in: result, $eq: username },
                         projectName: projectName,
                         task:task,
                         date:{ $gte: startDate,
                            $lt: endDate}
                        }).then((docs)=>{
                            console.log(docs)
                            return res.send(docs)
                    }).catch(err => res.send(err))

                }
                else if (projectName && username && date){
                    const requestedDate = date
                    const startDate = new Date(requestedDate);
                    const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000); // Adding one day to include the entire day
                    tasks.find({ assignedTo: { $in: result, $eq: username },
                        date:{ $gte: startDate,
                            $lt: endDate},
                        projectName: projectName,
                       }).then((docs)=>{
                           console.log(docs)
                           return res.send(docs)
                   }).catch(err => res.send(err))

                }
                else if (projectName && username){
                    tasks.find({ assignedTo: { $in: result, $eq: username },
                        projectName: projectName,
                       }).then((docs)=>{
                           console.log(docs)
                           return res.send(docs)
                   }).catch(err => res.send(err))


                }
                
                else if (projectName){
                    // console.log('true')
                    tasks.find({assignedTo:{$in:result}, 
                        projectName:projectName}).then((docs)=>{

                            return res.send(docs)
                    }).catch(err => res.send(err))

                }
                else if (username){
                    tasks.find({ assignedTo: { $in: result, $eq: username }}).then((docs)=>{
                        // console.log(docs)
                            return res.send(docs)
                    }).catch(err => res.send(err))
                }
                else if (date){
                    const requestedDate = date
                    const startDate = new Date(requestedDate);
                    const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000); // Adding one day to include the entire day

                    tasks.find({assignedTo:{$in:result},
                        // date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }
                        date:{ $gte: startDate,
                            $lt: endDate}
                    }).then((docs)=>{
                        // console.log(docs)
                        return res.send(docs)
                    }).catch(err => res.send(err))
                }
                else{
                   
                    tasks.find({assignedTo:{$in:result},
                        // date:{ $gte: startDate,
                        //     $lt: endDate}
                    }).then((docs)=>{
                        // console.log(docs)
                        return res.send(docs)
                    }).catch(err => res.send(err))
                } 
            }).catch(err => res.send(err))
        },
        async reportsByDate(req,res){
            const getdate = req.query.day

                employee.find({tlusername:req.user.username}).then((reports)=>{
                    const result = reports.map((doc => doc.username))

                
                    if (getdate === 'today') {
                        console.log('today triggered...');
                      
                        const now = new Date();
                        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0); // Set local time to start of the day
                      
                        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999); // Set local time to end of the day
                      
                        tasks
                          .find({ assignedTo: { $in: result }, date: { $gte: todayStart, $lte: todayEnd } })
                          .then(docs => {
                            console.log(docs);
                            res.send(docs);
                          })
                          .catch(err => res.send(err));
                      }
                      else if (getdate === 'yesterday') {
                        console.log('yesterday triggered...');
                      
                        const now = new Date();
                        const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0); // Set local time to start of yesterday
                      
                        const yesterdayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999); // Set local time to end of yesterday
                      
                        tasks
                          .find({ assignedTo: { $in: result }, date: { $gte: yesterdayStart, $lte: yesterdayEnd } })
                          .then(docs => {
                            console.log(docs);
                            res.send(docs);
                          })
                          .catch(err => res.send(err));
                      }
                      else if (getdate === 'last3days') {
                        console.log('last 3 days triggered...');
                      
                        const now = new Date();
                        const threeDaysAgoStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 0, 0, 0); // Set local time to start of 3 days ago
                      
                        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999); // Set local time to end of today
                      
                        tasks
                          .find({ assignedTo: { $in: result }, date: { $gte: threeDaysAgoStart, $lte: todayEnd } })
                          .then(docs => {
                            console.log(docs);
                            res.send(docs);
                          })
                          .catch(err => res.send(err));
                      }
                    else if (getdate === 'last7days') {
                        console.log('last 7 days triggered...');
                      
                        const now = new Date();
                        const sevenDaysAgoStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0); // Set local time to start of 7 days ago
                      
                        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999); // Set local time to end of today
                      
                        tasks
                          .find({ assignedTo: { $in: result }, date: { $gte: sevenDaysAgoStart, $lte: todayEnd } })
                          .then(docs => {
                            console.log(docs);
                            res.send(docs);
                          })
                          .catch(err => res.send(err));
                      }

                }).catch(err => res.send(err))
            
          
            
        },
    }
}
module.exports = teamLeadController


