import axios from 'axios';
import React, { useState } from 'react'
import { BASE_URL, post_config } from '../../Url';
import Modal from '../../shared/Modal';
import { Link } from 'react-router-dom';



type TForm = {

    phone: string;
}

let obj: TForm = {

    phone: ""
}
const LoginSeller = ({ setToggleAuth }: { setToggleAuth: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [form, setForm] = useState<TForm>(obj);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const handleOpenModal = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };
    const handleSubmitOTP = async () => {
        console.log(form);
        const res = await axios.post(`${BASE_URL}/auth/seller-login`, form, post_config);
        console.log(res.data)
    }
    return (
        <div className="w-screen h-screen flex items-center justify-center text-[1.6rem]">

            <Modal isOpen={modalOpen} onClose={handleCloseModal}>

                <h2 className='text-center '>OTP sent at 9982520785!</h2>
                <div className=" h-[80%] flex flex-col items-center justify-evenly text-center">
                    <label className="w-full flex flex-col gap-1 " htmlFor="otp">Fill OTP <input className="p-2 rounded-md" autoComplete="on" placeholder="4-digit OTP" type="number" name="phone" pattern="[0-9]{10}" maxLength={10} minLength={10} value={form.phone} onChange={((e) => setForm({ ...form, phone: e.target.value }))} required /></label>
                    <button className='bg-violet-600 text-white px-2 py-1 rounded-lg text-2xl w-44 ' onClick={handleSubmitOTP}>Submit OTP</button>

                </div>
                <div className="flex justify-end">
                    <button className='bg-red-600 text-white px-2 py-1 rounded-lg ' onClick={handleCloseModal}>Close</button>
                </div>
            </Modal>

            <div className=" w-full h-full flex flex-col items-center justify-center p-10  max-w-[1700px] bg-[#eceff8] ">

                <div className=" flex flex-col items-center justify-center   p-3   rounded-lg w-[35rem]  shadow-lg text-2xl">
                <h1 className="w-full text-center text-2xl">For Sellers!</h1>
                    <h3 className="p-6 text-2xl">Don't have an account? <a className="text-blue-600" role="button" onClick={() => setToggleAuth(true)} >Sign Up</a></h3>
                    <h1 className="line">OR</h1>
                    <form onSubmit={handleOpenModal} className="flex flex-col items-start justify-center p-3 gap-8 w-full" >

                        <label className="w-full flex flex-col gap-1 " htmlFor="phone">Seller Phone No.<input className="p-2 rounded-md" autoComplete="on" placeholder="10-digit Phone number" type="tel" name="phone" pattern="[0-9]{10}" maxLength={10} minLength={10} required /></label>

                        <button type="submit" className="rounded-lg w-full text-2xl p-2 bg-indigo-600  text-white">
                            Log In
                        </button>


                    </form>
                </div>
                <Link to="/delivery-auth" className='fixed bottom-16 '> <span className='text-blue-500 underline'>Login form for delivery boys!</span></Link>


            </div>
        </div>
    )
}

export default LoginSeller
