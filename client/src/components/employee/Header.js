const Header = ()=>{
    return (
        <>
            <div className="flex justify-around h-16 bg-white text-black items-center ">
                <h1 className="font-extrabold">Welcome</h1>
                <button className="bg-black text-white border-solid border-2 border-indigo-600 h-10 rounded-lg">Team Reports</button>
                <button className="bg-black text-white border-solid border-2 border-indigo-600 h-10 rounded-lg">Task History</button>
                <button className="bg-black text-white border-solid border-2 border-indigo-600 h-10 rounded-lg">Logout</button>
            </div>



        </>
    )

}
export default Header