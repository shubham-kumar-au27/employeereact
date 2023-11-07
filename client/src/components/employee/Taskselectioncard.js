const SelectTask =()=>{
    return (
        <div className=" m-8 p-4 bg-white w-60 h-64 border-solid border-2 border-black items-center rounded-lg ">
            <h1>Select Task</h1>
            <div>
            <label>Project :</label>
            <select>
                <option></option>
                <option></option>
                <option></option>
            </select>
            </div>
            <div>
            <label>Task :</label>
            <select>
                <option></option>
                <option></option>
                <option></option>
            </select>
            </div>
            <div>
            <label>Duration :</label>
            <select>
                <option></option>
                <option></option>
                <option></option>
            </select>
            </div>
            <button className="bg-black p-1 text-white">Add Task</button>



        </div>
    )

}

export default SelectTask