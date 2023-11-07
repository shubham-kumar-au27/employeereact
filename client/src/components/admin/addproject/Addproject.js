import React from "react";
import { useState, useEffect } from "react";
import NavComponent from "../Header";
import Shimmer from "../../Shimmer"
import { Link } from "react-router-dom";
import axios from 'axios';
import { DeleteOutlined } from '@ant-design/icons';
import Pagination from "react-js-pagination";
import { Button, Modal,notification, Space} from 'antd';

const AddProject = () => {
  const [projects, setprojects] = useState([]);
  const [filteredProjects, setfilteredprojects] = useState([]);
  const [searchText, setsearchText] = useState(""); // for searching projects-----///////////////-=====-----======-------


  const [projectName,setProjectName] = useState("") 
  const [task,setTask] = useState("")

  useEffect(() => {
    fetchData();
  }, []);
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type) =>{
    api[type]({
      message: 'Project Added Successfully',
      description:'',
    });
  }

  //for adding new Project----
  const handleAddProjectName = (projectName,task)=>{
    axios.post('http://localhost:3000/project',{projectName,task}).then((resp)=>{
      openNotificationWithIcon('success')
    
      console.log(resp)

    }).catch(err =>   openNotificationWithIcon(`error ${err}`))
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () =>{
    setIsModalOpen(true);
  };
  const handleOk = () =>{
    setIsModalOpen(false);
  };
  const handleCancel = () =>{
    setIsModalOpen(false);
  };

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (pageNumber) =>{
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);

  

  useEffect(() => {
    const filterProject = projects.filter((project) =>
      project.projectName.toLowerCase().includes(searchText.toLowerCase())
    );
    setfilteredprojects(filterProject);
  }, [searchText, projects]);

  const fetchData = async () => {
    try {
      // Fetch projects from the backend when the component mounts
      const response = await axios.get('http://localhost:3000/addproject');
      setprojects(response.data); // Update the 'projects' state with the fetched data
      setfilteredprojects(response.data); // Update the 'filteredProjects' state with the fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // function for deleting Task------
  const deleteTask = async (projectId, task) => {
    try {
   
      await axios.post('http://localhost:3000/deleteTask', { projectId, taskName: task });
      // After deletion, fetch the updated data again
      await fetchData(); // This will fetch the updated projects and trigger a rerender
    } catch (err) {
      console.log(err);
    }
  };
  

  if (projects.length === 0) { 
    return <Shimmer />;
  }

  return (
    <>
      <NavComponent />
      <div className="searchContainer">
        <input
          className="inputBox"
          value={searchText}
          onChange={(e) => {
            setsearchText(e.target.value);
          }}
        />
      </div>
  <div>
      <button className="m-2 p-1 bg-black text-white rounded-md w-32" type="primary" onClick={showModal}>
        Add Project
      </button>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <label>Add Project Name</label><br/>
        <input  placeholder="project"
        onChange={(e)=>{
          setProjectName(e.target.value)

        }}
        /><br/>
        <label>Add Task</label><br/>
        <input placeholder="task"
          onChange={(e)=>{
            setTask(e.target.value)
          }}
          
        />
      <br/>
      {contextHolder}
      <Space>
      <button onClick={()=>{       
          handleAddProjectName(projectName,task)
        }}>Add</button>

      </Space>
      </Modal>
        <button className="m-2 p-1 bg-black text-white rounded-md w-32">Add Task</button>
        <button className="m-2 p-1 bg-black text-white rounded-md w-32"><Link to="/assigntask">Assign</Link></button>
        <button className="m-2 p-1 bg-black text-white rounded-md w-32">Delete Project</button>
      </div>
      <div className="tableContainer">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">ProjectName</th>
              <th scope="col">Task</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((project) => (
              project.task.map((Task, index) => (
                <tr key={project._id + index}>
                  <td>{project.date}</td>
                  <td>{project.projectName}</td>
                  <td>{Task}</td>
                  <td>
                      <DeleteOutlined onClick={() => deleteTask(project._id, Task)}/>
                  </td>
                </tr>
              ))
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
  );
};
export default AddProject;