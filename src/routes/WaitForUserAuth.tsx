import { useNavigate } from "react-router-dom"

const WaitForUserAuth = () => {

const navigate = useNavigate();

setTimeout(()=>{
    navigate('/buyer-auth');
},4000)

    return (
        <div className="w-screen h-screen flex flex-col gap-5 items-center justify-center ">
            <h1 className="text-center text-7xl text-black ">LocalMile</h1>
            <h1 className="text-center text-4xl text-slate-600 ">Please wait... </h1>
        </div>
    )
}

export default WaitForUserAuth
