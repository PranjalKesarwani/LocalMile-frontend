import React, { useState } from 'react'
import Modal from '../../shared/Modal'
import axios from 'axios';
import { BASE_URL, post_config } from '../../Url';
import { Link, useNavigate } from 'react-router-dom';


type TForm = {
    buyerName: string;
    phone: string;
}

let obj: TForm = {
    buyerName: "",
    phone: ""
}

const SignupBuyer = ({ setToggleAuth }: { setToggleAuth: React.Dispatch<React.SetStateAction<boolean>> }) => {

    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [form, setForm] = useState<TForm>(obj);

    const handleOpenModal = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };
    const handleSubmitOTP = async () => {
        
        try {
            const res = await axios.post(`${BASE_URL}/auth/buyer-signup`, form, post_config);
      
            if(res.status===201){
                console.log('buyer created',res.data);
                navigate('/buyer-landing');
                
            }
           
        } catch (error:any) {
 
            if (error.response && error.response.status === 409) {
                alert('Account already exists. Please log in or use a different account.');
    
            } else if(error.response && error.response.status === 500){
                alert('Internal Server Error! Please try after some time');
            }else{
                alert('An error occurred. Please try again.');

            }
        }
       
    }
    return (
        <div className="w-screen h-screen flex items-center justify-center text-[1.6rem] ">

            <Modal isOpen={modalOpen} onClose={handleCloseModal}>

                <h2 className='text-center '>OTP sent at 9982520785!</h2>
                <div className=" h-[80%] flex flex-col items-center justify-evenly text-center">
                    <label className="w-full flex flex-col gap-1 " htmlFor="otp">Fill OTP <input className="p-2 rounded-md" autoComplete="on" placeholder="4-digit OTP" type="number" name="phone" pattern="[0-9]{10}" maxLength={10} minLength={10} required /></label>
                    <button className='bg-violet-600 text-white px-2 py-1 rounded-lg text-2xl w-44 ' onClick={handleSubmitOTP}>Submit OTP</button>

                </div>
                <div className="flex justify-end">

                    <button className='bg-red-600 text-white px-2 py-1 rounded-lg ' onClick={handleCloseModal}>Close</button>
                </div>
            </Modal>


            <div className=" w-full h-full flex flex-col items-center justify-center p-10   max-w-[1700px] bg-[#eceff8]  "  >

                <div className="  flex flex-col items-center justify-center  p-3    rounded-lg  w-[40rem] h-[40rem] shadow-lg">
                    <h1 className="w-full text-center text-2xl">For Customers!</h1>
                    <h3 className="p-6 text-2xl">Already have an account? <a className="text-blue-600" role="button" onClick={() => setToggleAuth(false)}  >Log In</a></h3>

                    <h1 className="line">OR</h1>

                    <form onSubmit={handleOpenModal} className="  flex flex-col items-start justify-center p-3 gap-8 w-full" >

                        <label className="w-full flex flex-col gap-1" htmlFor="username" >Full Name <input className="p-2 rounded-md " placeholder="Full Name" type="text" name="username" id="username" value={form.buyerName} onChange={((e) => setForm({ ...form, buyerName: e.target.value }))} required /></label>

                        <label className="w-full flex flex-col gap-1 " htmlFor="phone">Phone<input className="p-2 rounded-md " autoComplete="on" placeholder="10-digit Phone number" type="tel" id="phone" name="phone" pattern="[0-9]{10}" maxLength={10} minLength={10} value={form.phone} onChange={((e) => setForm({ ...form, phone: e.target.value }))} required /></label>

                        <button type="submit" className="rounded-lg w-full text-2xl p-2 bg-indigo-600 text-white">
                            Sign Up
                        </button>



                    </form>


                </div>

                
                <Link to="/seller-auth" className='fixed bottom-16 '>Want to open a store? <span className='text-blue-500 underline'>Click here</span></Link>

            </div>
        </div>
    )
}

export default SignupBuyer
