import {useEffect, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const Login = ()=>{
    const [userName,setuserName] = useState('')
    const [password,setPassword] = useState('')
    const Navigate = useNavigate()


    useEffect(()=>{
       
        

    },[])
    const handleLogin = async ()=>{
        try{
            const Login = await axios.post('http://localhost:3000/login/',{username:userName,password:password})
            const userDetails = await Login.data
            Navigate('/admincontrols')
            console.log(userDetails)
        }
        catch (err){
            console.log(err)
            Navigate("/")
        }
    //   .then((response)=>{
    //         console.log('called...')
    //         console.log(response)
    //         Navigate("/admincontrols")
    //     }).catch(err => console.log(err))
    }
    
   

    return(
    <>
        <div className="mt-8 space-y-6" >
        <div className="rounded-md shadow-sm -space-y-px">
            <div>
            <label className="sr-only">
                username
            </label>
            <input
                // required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none
                 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="username"
                value={userName}
                onChange={(e)=> setuserName(e.target.value) }
                
            />
            </div>
            <div>
            <label  className="sr-only">
                Password
            </label>
            <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 
                rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"  
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
            />
            </div>
        </div>

        <div>
            <button
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md
             text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
             onClick={()=>handleLogin()}
            >
            Login
            </button>
        </div>
        </div>
        </>
    )

}

export default Login