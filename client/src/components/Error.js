import { useRouteError } from "react-router-dom"
const ErrorComponent = ()=>{
    const err = useRouteError()
    return (
        <>
            <h1>{err.status}</h1>
        </>

    )
    

}
    


export default ErrorComponent