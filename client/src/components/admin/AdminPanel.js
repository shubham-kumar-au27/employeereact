import { useState, useEffect } from "react";
import NavComponent from "./Header"
import axios from "axios";
// import { Pagination } from 'antd';
import {DeleteOutlined,EditOutlined} from '@ant-design/icons';
import Pagination from 'react-js-pagination';
import Shimmer from "../Shimmer";

// console.log(employees)
const AdminPanel = ()=>{
  const itemsPerPage = 10;
 
  const [employees,setEmployees] = useState([])
  const [filteredEmployees,setfilteredEmployees] = useState([])
  const [searchText,setsearchText] = useState("") //for search in admin panel-------

  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(()=>{
      fetchData()
   
},[])
const fetchData = ()=>{
  axios.get('http://localhost:3000/adminpanel')
  .then((response) =>{
    setEmployees(response.data); // Update the 'data' state with the fetched data
    setfilteredEmployees(response.data);
  })
  .catch((error)=>{
    console.error('Error fetching data:', error);
  });
}
//handle search query--------
const handleSearch = () => {
  console.log("button clicked")
  const filterEmployee = employees.filter((employee) =>
    Object.values(employee).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );
  setfilteredEmployees(filterEmployee);
};
if (employees.length == 0){
  return <Shimmer/>
}
  return (
        <>
          <NavComponent/>
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
                <th scope="col">Add Profile</th>
                <th scope="col">First Name</th>
                <th scope="col">LastName</th>
                <th scope="col">Designation</th>
                <th scope="col">Team Leader</th>
                <th scope="col">UserName</th>
                <th scope="col">Date of Birth</th>
                <th scope="col">Email</th>
                <th scope="col">Password</th>
                <th scope="col">LastLogin</th>
                <th scope="col">Delete</th>
                <th scope="col">Edit</th>
                </tr>
            </thead>
              <tbody>
                {currentItems.map((employee)=>(
                  <tr key={employee._id}>
                    <td>{
    
                      employee.image ? <span>Image Already uploaded</span> : <button>upload</button>
                      }
                    </td>
                    <td>{employee.firstName}</td>
                    <td>{employee.lastName}</td>
                    <td>{employee.designation}</td>
                    <td>{employee.teamLeader}</td>
                    <td>{employee.username}</td>
                    <td>{employee.date_of_birth}</td>
                    <td>{employee.email}</td>
                    <td>{employee.password}</td>
                    <td>{employee.lastLogin}</td>
                    <td><DeleteOutlined onClick={async ()=>{
                      console.log(employee._id)
                      await axios.post('http://localhost:3000/deleteuser',{Id:employee._id}).then((success)=>{
                        console.log(success)
                        fetchData()
                        
                      }).catch(err => console.log(err));
                    }}/>
                    </td>
                    <td><EditOutlined /></td>
                  </tr>
                ))}
              </tbody>
          </table>
          <Pagination
        activePage={currentPage}
        itemsCountPerPage={itemsPerPage}
        totalItemsCount={filteredEmployees.length}
        pageRangeDisplayed={5}
        onChange={handlePageChange}
        itemClass="page-item"
        linkClass="page-link"
      />
          </div>
        </>
    )
}
export default AdminPanel