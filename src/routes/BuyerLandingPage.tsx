// import React from 'react'

import axios from "axios";
import { BASE_URL, get_config } from "../Url";
import NavBuyer from "../components/buyer/NavBuyer"
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const BuyerLandingPage = () => {

    const [availableCategories, setAvailableCategories] = useState<string[]>([]);
    const navigate = useNavigate();


    const availableCategoriess = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/pin/get-available-categories`, get_config);
            if (res.status === 200) {
                console.log(res.data);
                setAvailableCategories(() => [...res.data.shopCategories]);
            }

        } catch (error) {
            console.log(error);
            alert('Internal server error!');
        }
    }

    useEffect(() => {
        availableCategoriess();
    }, []);

    const shopDetails = () => {

        navigate('/buyer-landing/visit-shop');
    }
    return (
        <>


            <NavBuyer />
            <div className=" w-full p-12 ">
                <ul className=" flex overflow-x-auto space-x-4 p-4 w-full  y-scrollbar text-2xl shadow-lg">
                    {
                        availableCategories.length === 0 ? <div className="w-full flex items-center justify-center h-[20rem] shadow-lg">Loading...</div> : <>
                            {
                                availableCategories.map((category, idx) => {

                                    return <div key={idx} className="border border-gray-300 min-w-[20rem] min-h-[20rem] text-center p-2 rounded cursor-pointer flex items-center justify-center" >{category}</div>
                                })
                            }
                        </>
                    }




                </ul>
            </div>
            <hr />
            <div className="flex items-center justify-center text-9xl text-slate-400">ALL SHOPS</div>
            <hr />
            <div className="shopContainer w-full  p-3 flex items-center justify-center">

                <div className=" w-[80%] p-2 flex flex-wrap space-x-10  justify-center ">
                    <div className=" w-[35rem]  m-8  hover:shadow-lg  p-3 rounded-xl cursor-pointer" onClick={shopDetails}>
                        <img src="https://images.pexels.com/photos/235525/pexels-photo-235525.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Cloth image" className="w-[97%] h-[20rem]   mx-auto rounded-xl" />
                        <div className="w-full h-full p-1 text-2xl">
                            <h1 className="font-semibold text-2xl"> Shop name: Hemchandra Vastra Bhandar</h1>
                            <h1 className="text-slate-600">Owner name: Hemchandra Kesarwani</h1>
                            <h1 className="text-slate-600">Address: Sahson Gol Chauraha</h1>

                        </div>
                    </div>
                    <div className=" w-[35rem]  m-8  hover:shadow-lg  p-3 rounded-xl">
                        <img src="https://images.pexels.com/photos/235525/pexels-photo-235525.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Cloth image" className="w-[97%] h-[20rem]   mx-auto rounded-xl" />
                        <div className="w-full h-full p-1 text-2xl">
                            <h1 className="font-semibold text-2xl"> Shop name: Hemchandra Vastra Bhandar</h1>
                            <h1 className="text-slate-600">Owner name: Hemchandra Kesarwani</h1>
                            <h1 className="text-slate-600">Address: Sahson Gol Chauraha</h1>

                        </div>
                    </div>
                    <div className=" w-[35rem]  m-8  hover:shadow-lg  p-3 rounded-xl">
                        <img src="https://images.pexels.com/photos/235525/pexels-photo-235525.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Cloth image" className="w-[97%] h-[20rem]   mx-auto rounded-xl" />
                        <div className="w-full h-full p-1 text-2xl">
                            <h1 className="font-semibold text-2xl"> Shop name: Hemchandra Vastra Bhandar</h1>
                            <h1 className="text-slate-600">Owner name: Hemchandra Kesarwani</h1>
                            <h1 className="text-slate-600">Address: Sahson Gol Chauraha</h1>

                        </div>
                    </div>
                    <div className=" w-[35rem]  m-8  hover:shadow-lg  p-3 rounded-xl">
                        <img src="https://images.pexels.com/photos/235525/pexels-photo-235525.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Cloth image" className="w-[97%] h-[20rem]   mx-auto rounded-xl" />
                        <div className="w-full h-full p-1 text-2xl">
                            <h1 className="font-semibold text-2xl"> Shop name: Hemchandra Vastra Bhandar</h1>
                            <h1 className="text-slate-600">Owner name: Hemchandra Kesarwani</h1>
                            <h1 className="text-slate-600">Address: Sahson Gol Chauraha</h1>

                        </div>
                    </div>
                    <div className=" w-[35rem]  m-8  hover:shadow-lg  p-3 rounded-xl">
                        <img src="https://images.pexels.com/photos/235525/pexels-photo-235525.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Cloth image" className="w-[97%] h-[20rem]   mx-auto rounded-xl" />
                        <div className="w-full h-full p-1 text-2xl">
                            <h1 className="font-semibold text-2xl"> Shop name: Hemchandra Vastra Bhandar</h1>
                            <h1 className="text-slate-600">Owner name: Hemchandra Kesarwani</h1>
                            <h1 className="text-slate-600">Address: Sahson Gol Chauraha</h1>

                        </div>
                    </div>
                    <div className=" w-[35rem]  m-8  hover:shadow-lg  p-3 rounded-xl">
                        <img src="https://images.pexels.com/photos/235525/pexels-photo-235525.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Cloth image" className="w-[97%] h-[20rem]   mx-auto rounded-xl" />
                        <div className="w-full h-full p-1 text-2xl">
                            <h1 className="font-semibold text-2xl"> Shop name: Hemchandra Vastra Bhandar</h1>
                            <h1 className="text-slate-600">Owner name: Hemchandra Kesarwani</h1>
                            <h1 className="text-slate-600">Address: Sahson Gol Chauraha</h1>

                        </div>
                    </div>
                    <div className=" w-[35rem]  m-8  hover:shadow-lg  p-3 rounded-xl">
                        <img src="https://images.pexels.com/photos/235525/pexels-photo-235525.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Cloth image" className="w-[97%] h-[20rem]   mx-auto rounded-xl" />
                        <div className="w-full h-full p-1 text-2xl">
                            <h1 className="font-semibold text-2xl"> Shop name: Hemchandra Vastra Bhandar</h1>
                            <h1 className="text-slate-600">Owner name: Hemchandra Kesarwani</h1>
                            <h1 className="text-slate-600">Address: Sahson Gol Chauraha</h1>

                        </div>
                    </div>
                    <div className=" w-[35rem]  m-8  hover:shadow-lg  p-3 rounded-xl">
                        <img src="https://images.pexels.com/photos/235525/pexels-photo-235525.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Cloth image" className="w-[97%] h-[20rem]   mx-auto rounded-xl" />
                        <div className="w-full h-full p-1 text-2xl">
                            <h1 className="font-semibold text-2xl"> Shop name: Hemchandra Vastra Bhandar</h1>
                            <h1 className="text-slate-600">Owner name: Hemchandra Kesarwani</h1>
                            <h1 className="text-slate-600">Address: Sahson Gol Chauraha</h1>

                        </div>
                    </div>
                    <div className=" w-[35rem]  m-8  hover:shadow-lg  p-3 rounded-xl">
                        <img src="https://images.pexels.com/photos/235525/pexels-photo-235525.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Cloth image" className="w-[97%] h-[20rem]   mx-auto rounded-xl" />
                        <div className="w-full h-full p-1 text-2xl">
                            <h1 className="font-semibold text-2xl"> Shop name: Hemchandra Vastra Bhandar</h1>
                            <h1 className="text-slate-600">Owner name: Hemchandra Kesarwani</h1>
                            <h1 className="text-slate-600">Address: Sahson Gol Chauraha</h1>

                        </div>
                    </div>
                    <div className=" w-[35rem]  m-8  hover:shadow-lg  p-3 rounded-xl">
                        <img src="https://images.pexels.com/photos/235525/pexels-photo-235525.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Cloth image" className="w-[97%] h-[20rem]   mx-auto rounded-xl" />
                        <div className="w-full h-full p-1 text-2xl">
                            <h1 className="font-semibold text-2xl"> Shop name: Hemchandra Vastra Bhandar</h1>
                            <h1 className="text-slate-600">Owner name: Hemchandra Kesarwani</h1>
                            <h1 className="text-slate-600">Address: Sahson Gol Chauraha</h1>

                        </div>
                    </div>
                    <div className=" w-[35rem]  m-8  hover:shadow-lg  p-3 rounded-xl">
                        <img src="https://images.pexels.com/photos/235525/pexels-photo-235525.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Cloth image" className="w-[97%] h-[20rem]   mx-auto rounded-xl" />
                        <div className="w-full h-full p-1 text-2xl">
                            <h1 className="font-semibold text-2xl"> Shop name: Hemchandra Vastra Bhandar</h1>
                            <h1 className="text-slate-600">Owner name: Hemchandra Kesarwani</h1>
                            <h1 className="text-slate-600">Address: Sahson Gol Chauraha</h1>

                        </div>
                    </div>
                    <div className=" w-[35rem]  m-8  hover:shadow-lg  p-3 rounded-xl">
                        <img src="https://images.pexels.com/photos/235525/pexels-photo-235525.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Cloth image" className="w-[97%] h-[20rem]   mx-auto rounded-xl" />
                        <div className="w-full h-full p-1 text-2xl">
                            <h1 className="font-semibold text-2xl"> Shop name: Hemchandra Vastra Bhandar</h1>
                            <h1 className="text-slate-600">Owner name: Hemchandra Kesarwani</h1>
                            <h1 className="text-slate-600">Address: Sahson Gol Chauraha</h1>

                        </div>
                    </div>
                    <div className=" w-[35rem]  m-8  hover:shadow-lg  p-3 rounded-xl">
                        <img src="https://images.pexels.com/photos/235525/pexels-photo-235525.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Cloth image" className="w-[97%] h-[20rem]   mx-auto rounded-xl" />
                        <div className="w-full h-full p-1 text-2xl">
                            <h1 className="font-semibold text-2xl"> Shop name: Hemchandra Vastra Bhandar</h1>
                            <h1 className="text-slate-600">Owner name: Hemchandra Kesarwani</h1>
                            <h1 className="text-slate-600">Address: Sahson Gol Chauraha</h1>

                        </div>
                    </div>
                    <div className=" w-[35rem]  m-8  hover:shadow-lg  p-3 rounded-xl">
                        <img src="https://images.pexels.com/photos/235525/pexels-photo-235525.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Cloth image" className="w-[97%] h-[20rem]   mx-auto rounded-xl" />
                        <div className="w-full h-full p-1 text-2xl">
                            <h1 className="font-semibold text-2xl"> Shop name: Hemchandra Vastra Bhandar</h1>
                            <h1 className="text-slate-600">Owner name: Hemchandra Kesarwani</h1>
                            <h1 className="text-slate-600">Address: Sahson Gol Chauraha</h1>

                        </div>
                    </div>
                    <div className=" w-[35rem]  m-8  hover:shadow-lg  p-3 rounded-xl">
                        <img src="https://images.pexels.com/photos/235525/pexels-photo-235525.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Cloth image" className="w-[97%] h-[20rem]   mx-auto rounded-xl" />
                        <div className="w-full h-full p-1 text-2xl">
                            <h1 className="font-semibold text-2xl"> Shop name: Hemchandra Vastra Bhandar</h1>
                            <h1 className="text-slate-600">Owner name: Hemchandra Kesarwani</h1>
                            <h1 className="text-slate-600">Address: Sahson Gol Chauraha</h1>

                        </div>
                    </div>









                </div>

            </div>

            <Footer />


        </>

    )
}

export default BuyerLandingPage
