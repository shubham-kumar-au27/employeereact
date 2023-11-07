import { useState, useEffect } from "react";
import axios from 'axios';
import NavComponent from "./Header";
import Shimmer from "../Shimmer";
import Pagination from "react-js-pagination";
const TaskReports = ()=>{
    const [data, setData] = useState([]);
    const [filteredData,setfilteredData] = useState([])
    const [searchText,setsearchText] = useState("");

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
  
    const handlePageChange = (pageNumber) =>{
      setCurrentPage(pageNumber);
    };
  
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  

    useEffect(() => {
        // Fetch data from the backend when the component mounts
        axios.get('http://localhost:3000/taskdetails')
          .then((response) => {
            setData(response.data); // Update the 'data' state with the fetched data
            setfilteredData(response.data)
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      }, []);
      if (data.length == 0){
        return <Shimmer/>
      }

       //handle search query--------
       const handleSearch = () => {
        const filterdata = data.filter((project) =>
          Object.values(project).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
          )
        );
        setfilteredData(filterdata);
      };
    return(
        <>
        <NavComponent/>

        
      <div className="searchContainer">
        <input className="border-double border-4 border-indigo-600" value={searchText} onChange={(e)=>{
                      setsearchText(e.target.value)
                  }}/>
        <button className="btn btn-dark" onClick={handleSearch}>Search</button>
      </div>
        <div className="tableContainer">
        <table className="table" >
        <thead>
            <tr>
            <th scope="col">Project</th>
            <th scope="col">taskStatus</th>
            <th scope="col">Task</th>
            <th scope="col">TimeTaken</th>
            </tr>
        </thead>
        <tbody>
            {currentItems.map((items)=>(
                //    {console.log(data.length)}
                   <tr key={items._id}>
                   <td>{items.projectName}</td>
                   <td>{items.taskStatus}</td>
                   <td>{items.task}</td>
                   <td>{items.timetaken}</td>
                   </tr>
            ))}
           
            
        </tbody>
        </table>
        <Pagination
        activePage={currentPage}
        itemsCountPerPage={itemsPerPage}
        totalItemsCount={filteredData.length}
        pageRangeDisplayed={5}
        onChange={handlePageChange}
        itemClass="page-item"
        linkClass="page-link"
      />

    </div>
        </>
    )
}
export default TaskReports