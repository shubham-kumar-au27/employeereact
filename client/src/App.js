import React, { lazy,Suspense} from "react";
import ReactDOM from 'react-dom/client';
import Controls from "./components/admin/Admincontrols";
import AddProject from "./components/admin/addproject/Addproject"
import {createBrowserRouter,RouterProvider,Outlet} from 'react-router-dom';
import ErrorComponent from "./components/Error";
import Login from "./components/admin/Loginpage";
// import AdminPanel from "./components/admin/AdminPanel";
// import TaskReports from "./components/admin/taskreports";
// import AssignTask from "./components/admin/AssignTask";
import Shimmer from "./components/Shimmer";
import Employeetask from "./components/employee/EmployeeTask";


const AdminPanel = lazy(()=> import("./components/admin/AdminPanel"));
const TaskReports = lazy(()=> import("./components/admin/taskreports"));
const AssignTask = lazy(()=> import("./components/admin/AssignTask"));
const Appcomponent = ()=>{

    return(
       <>

        <Outlet/>
        
       </>

    )
}

const appRouter = createBrowserRouter([
    {
        path:"/",
        element:<Appcomponent/>,
        children:[
            {
                path:"/",
                element:<Login/>
            },
            {
                path:"/admincontrols",
                element:<Controls/>,
            },
            {
                path:"/addproject",
                element:<AddProject/>
                
            },
            {
                path:"/adminpanel",
                element:<Suspense fallback={<Shimmer/>}><AdminPanel/></Suspense>
            },
            {
                path:"/taskreports",
                element:<Suspense fallback={<Shimmer/>}><TaskReports/></Suspense>
               
            },
            {
                path:"/assigntask",
                element:<Suspense fallback={<Shimmer/>}> <AssignTask/></Suspense>
               
            },
            {
                path:"/employeetask",
                element:<Employeetask/>
            }
            
        ],
        errorElement:<ErrorComponent/>
    },
    
])






const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<RouterProvider router={appRouter}/>)
