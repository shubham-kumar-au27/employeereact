import { Link } from "react-router-dom";
import NavComponent from "./Header";
const Controls = ()=>{
    return(
        <>
         <NavComponent/>
         <div className="flex bg-green-500 justify-between h-[100%] m-3">
            <div className="w-[50%]">
                <div className="bg-white h-60 w-[95%] p-3 m-2 flex  justify-center  items-center">
                    <button className=" bg-black text-white w-40 h-[25%] rounded-full ring-2 ring-yellow-400 ring-inset ">
                    <Link to="/addproject">AddProject</Link>
                    </button>
                </div>
                <div className="bg-white h-60 w-[95%] p-3 m-2 flex  justify-center items-center ">
                    <button className=" bg-black text-white w-40 h-[25%] rounded-full ring-2 ring-yellow-400 ring-inset">
                    <Link to="/adminpanel">Admin Panel</Link>
                    </button>
                </div>
            </div>
            <div className="w-[50%]">
            <div className="bg-white h-60 w-[95%] p-3 m-2 flex  justify-center items-center ">
                <button className=" bg-black text-white w-40 h-[25%] rounded-full ring-2 ring-yellow-400 ring-inset">
                    <Link to="/taskreports">Task Reports</Link>
                </button>
            </div>
            <div className="bg-white h-60 w-[95%] p-3 m-2 flex  justify-center items-center ">
                <button className=" bg-black text-white w-40 h-[25%] rounded-full ring-2 ring-yellow-400 ring-inset">Logout</button>
            </div>
            </div>
        </div>
        </>
       
    )
}
export default Controls