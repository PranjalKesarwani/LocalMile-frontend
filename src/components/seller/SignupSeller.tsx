import axios from 'axios';
import React, { useState } from 'react'
import { BASE_URL, post_config } from '../../Url';
import Modal from '../../shared/Modal';
import { Link } from 'react-router-dom';


type TForm = {
    sellerName: string;
    shopName:string;
    shopAddress:string;
    landmark:string;
    pinCode:string;
    phone: string;
    
}

let obj: TForm = {
    sellerName: "",
    shopName:"",
    shopAddress:"",
    landmark:"",
    pinCode:"",
    phone: "",
}

const SignupSeller = ({ setToggleAuth }: { setToggleAuth: React.Dispatch<React.SetStateAction<boolean>> }) => {
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
            const res = await axios.post(`${BASE_URL}/auth/seller-signup`, form, post_config);
            if(res.status === 201){
                
                alert('Request accepted! Please wait for admin approval or contact: 9982520785')
                console.log(res.data);
            }

        } catch (error:any) {
            if (error.response && error.response.status === 409) {
                alert('Account already exists. Please contact to admin: 9982520785.');
    
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

                <div className="  flex flex-col items-center justify-center  p-3    rounded-lg  w-[40rem]  shadow-lg">
                    <h1 className="w-full text-center text-2xl">For Sellers!</h1>
                    <h3 className="p-6 text-2xl">Already have an account? <a className="text-blue-600" role="button" onClick={() => setToggleAuth(false)}  >Log In</a></h3>

                    <h1 className="line">OR</h1>

                    <form onSubmit={handleOpenModal} className="  flex flex-col items-start justify-center p-3 gap-4 w-full text-2xl" >

                        <label className="w-full flex flex-col gap-1 " htmlFor="sellerName" >Seller Name<input className="p-2 rounded-md " placeholder="Seller Name" type="text" name="sellerName" id="sellerName" value={form.sellerName} onChange={((e) => setForm({ ...form, sellerName: e.target.value }))} required /></label>
                        <label className="w-full flex flex-col gap-1" htmlFor="shopName" >Shop Name<input className="p-2 rounded-md " placeholder="Shop Name" type="text" name="shopName" id="shopName" value={form.shopName} onChange={((e) => setForm({ ...form, shopName: e.target.value }))} required /></label>
                        <label className="w-full flex flex-col gap-1" htmlFor="shopAddress" >Shop Address<input className="p-2 rounded-md " placeholder="Shop Address" type="text" name="shopAddress" id="shopAddress" value={form.shopAddress} onChange={((e) => setForm({ ...form, shopAddress: e.target.value }))} required /></label>
                        <label className="w-full flex flex-col gap-1" htmlFor="pinCode" >Pin Code<input className="p-2 rounded-md " placeholder="Pin Code" type="text" name="pinCode" id="pinCode" value={form.pinCode} onChange={((e) => setForm({ ...form, pinCode: e.target.value }))} required /></label>
                        <label className="w-full flex flex-col gap-1" htmlFor="landmark" >Landmark<input className="p-2 rounded-md " placeholder="Landmark" type="text" name="landmark" id="landmark" value={form.landmark} onChange={((e) => setForm({ ...form, landmark: e.target.value }))} required /></label>

                        <label className="w-full flex flex-col gap-1 " htmlFor="phone">Seller Phone no.<input className="p-2 rounded-md " autoComplete="on" placeholder="10-digit Phone number" type="tel" id="phone" name="phone" pattern="[0-9]{10}" maxLength={10} minLength={10} value={form.phone} onChange={((e) => setForm({ ...form, phone: e.target.value }))} required /></label>

                        <button type="submit" className="rounded-lg w-full text-2xl p-2 bg-indigo-600 text-white">
                            Sign Up
                        </button>



                    </form>


                </div>

                
                <Link to="/delivery-auth" className='fixed bottom-16 '> <span className='text-blue-500 underline'>Login form for delivery boys!</span></Link>

            </div>
        </div>
    )
}

export default SignupSeller
