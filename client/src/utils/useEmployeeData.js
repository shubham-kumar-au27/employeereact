import { useEffect, useState} from "react";
import axios from "axios";
const useEmployeedata = () =>{
    
  const [employees,setEmployees] = useState([])
  const [filteredEmployees,setfilteredEmployees] = useState([])

    
    useEffect(()=>{
        fetchData()
     
  },[])
  const fetchData = async ()=>{
    await axios.get('http://localhost:3000/adminpanel')
    .then((response) =>{
        console.log('response has been generated')
    //   setEmployee(response.data); // Update the 'data' state with the fetched data
    //   setfilteredEmployees(response.data);
        // console.log(response.data)
        setEmployees(response.data)
        setfilteredEmployees(response.data)
    })
    .catch((error)=>{
      console.error('Error fetching data:', error);
    });
    return [employees,filteredEmployees]
  }

}

export default useEmployeedata;