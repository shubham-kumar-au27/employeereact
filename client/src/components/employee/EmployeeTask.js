import Header from "./Header"
import Profile from "./Profilecard"
import SelectTask from "./Taskselectioncard"


const Employeetask = ()=>{
    return (
        <>
          <Header/>
            <div className="flex justify-center bg-blue-200 h-[700px]">
                <div >
                    <SelectTask/>
                </div>  
                <div className="float-left">
                    <Profile/>
                </div>
                </div>
            
        </>
       
    )
}
export default Employeetask

