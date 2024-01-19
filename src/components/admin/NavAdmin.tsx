import { useContextStore } from "../../context/StoreContext";
import logo from '../../assets/localMile.png'

const NavAdmin = () => {
  const {titleImgUrl} = useContextStore();
  console.log(titleImgUrl);
  
  return (
    <div className="w-screen bg-slate-50 p-2 showBorder flex  text-3xl ">
      <div>
        
        <img src={logo} alt="LocalMile" className='w-52' />
        
          
      </div>
       

  </div>
  )
}

export default NavAdmin
