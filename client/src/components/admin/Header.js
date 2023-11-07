import { Link } from "react-router-dom"
const NavComponent = ()=>{
    return (
        <>
        <div className='flex justify-end shadow-sm bg-gray-100'>
            <div className='nav-items flex justify-between'>
                
                <button className="m-2"><Link to="/admincontrols">Home</Link>
                </button>
                <button className="m-2">
                    <Link to="/taskreports">Reports</Link>
                </button>
                <button className="m-2">
                    <Link to="/addproject">AddProject</Link>
                </button>
                <button className="m-2">
                    <Link to="/logout">Logout</Link>
                </button>
                
            </div>
    </div>
    </>

    )
    

}

export default NavComponent