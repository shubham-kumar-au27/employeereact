import NavComponent from "./Header"
import { useState, useEffect } from "react";
import axios from "axios";
import {DeleteOutlined} from '@ant-design/icons';
import Pagination from "react-js-pagination";
import Shimmer from "../Shimmer";

const AssignTask = ()=>{
    const [projectsData, setprojectsData] = useState([])
    const [assignedTask,setassignedTask] = useState([])
    const [employees,setEmployees] = useState([])
    const [selectedProject, setSelectedProject] = useState('');  //selected project-----
    const [selectedEmployee, setSelectedEmployee] = useState('');

    // search filter
    const [searchText,setsearchText] = useState("");
    let [filteredProjects, setfilteredprojects] = useState([]);
      useEffect(() => {
        fetchData();
      
      }, [])
      const fetchData = ()=>{
          // Fetch assignData from the backend when the component mounts
          axios.get('http://localhost:3000/addproject/project/')
          .then((response) =>{
            setassignedTask(response.data[2]);
            setfilteredprojects(response.data[2]);
            setEmployees(response.data[1]);
            setprojectsData(response.data[0]);
            
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      }

      const handleSelectedProject = (event) => {
        const selectedValue = event.target.value;
        setSelectedProject(selectedValue); // Update the state with the selected value
        // Perform any additional actions based on the selected value
        console.log('Selected Project:', selectedValue);
      };
      const handleSelectedEmployee= (event) => {
        const selectedValue = event.target.value;
        setSelectedEmployee(selectedValue); // Update the state with the selected value
        // Perform any additional actions based on the selected value
        console.log('Selected Employee:', selectedValue);
      };

      //handle search query--------
      const handleSearch = () => {
        const filterProject = assignedTask.filter((project) =>
          Object.values(project).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
          )
        );
        setfilteredprojects(filterProject);
      };
      // function for deleting Task------
  const handledelete = async (projectId) => {
    try {
      console.log(`${projectId} This is project Id`)
      await axios.post('http://localhost:3000/deleteAssignProject', { projectid:projectId});
      console.log('deleted successfully')
      // After deletion, fetch the updated data again
      fetchData(); // This will fetch the updated projects and trigger a rerender
      console.log('refreshed successfully....')
    } catch (err) {
      console.log(err);
    }
  };
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (pageNumber) =>{
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);





  //function for Assigning Projects-----
  const ProjectAssignment = async ()=>{
    console.log('btn clicked')
    try{
      await axios.post('http://localhost:3000/assignproject', { projectName:selectedProject,employee:selectedEmployee}).then((resp)=>{
        console.log("Project Assigned Successfully..")
        console.log(resp)
        fetchData()
      });
    }catch(err){
      console.log(err)
    }
  }
      if (assignedTask.length == 0){
        return <Shimmer/>
      }
    return (
        <>
            <NavComponent/>
            <div className="assignTaskTable">
                <table className="table">
                <thead>
            <tr>
            <th scope="col">Project</th>
            <th scope="col">AssignTo</th>
            <th scope="col">Assign</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <select value={selectedProject} onChange={(e) => handleSelectedProject(e)}>
                    <option value="" disabled>Select a Project</option>
                    {projectsData.map((project) => (
                    <option key={project._id} value={project.projectName}>
                        {project.projectName}
                    </option>
                    ))}
                    </select>
                </td>
                <td>
                <select value={selectedEmployee} onChange={(e) => handleSelectedEmployee(e)}>
                    <option value="" disabled>Select Employee</option>
                    {employees.map((employee) => (
                    <option key={employee._id} value={employee.username}>
                        {`${employee.firstName} (${employee.username} )`}
                    </option>
                    ))}
                    </select>
                </td>
                <td><button className="btn btn-dark" onClick={()=>ProjectAssignment()}>Assign</button></td>
            </tr>
        </tbody>
        </table>
            </div>
        <div className="searchContainer">
            <input className="inputBox" value={searchText} onChange={(e)=>{
                            setsearchText(e.target.value)
                        }}/>
            <button className="btn btn-dark" onClick={handleSearch}>Search</button>
      </div>
        <div className="tableContainer">
        <table className="table">
        <thead>
            <tr>
            <th scope="col">Assigned Date</th>
            <th scope="col">Project</th>
            <th scope="col">Task</th>
            <th scope="col">Assigned To</th>
            <th scope="col">Delete</th>
            </tr>
        </thead>
        <tbody>
            {currentItems.map((data)=>(
                <tr key ={ data._id}>
                    <td>{data.date}</td>
                    <td>{data.projectName}</td>
                    <td>
                        <select>
                            {data.task.map((Task,index)=>(
                                <option key={index}  value={Task}>{Task}</option>
                            ))}
                        </select>
                    </td>
                    <td>{data.assignedTo}</td>
                    <td><DeleteOutlined onClick={()=>handledelete(data._id)}/></td>
                </tr>

            ))}
        </tbody>
        </table>
        <Pagination
        activePage={currentPage}
        itemsCountPerPage={itemsPerPage}
        totalItemsCount={filteredProjects.length}
        pageRangeDisplayed={5}
        onChange={handlePageChange}
        itemClass="page-item"
        linkClass="page-link"
      />
    </div>
</>
    )

}
export default AssignTask