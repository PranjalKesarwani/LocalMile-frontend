import { useNavigate } from "react-router-dom"

const ErrorPage = () => {

const navigate = useNavigate();

    return (
        <div className="w-screen h-screen flex flex-col gap-5 items-center justify-center ">
            <h1 className="text-center text-7xl text-black ">Error 404!</h1>
            
            <button className="text-center text-4xl text-slate-600 " onClick={()=>navigate('/')}>Go to first page</button>
        </div>
    )
}

export default ErrorPage
