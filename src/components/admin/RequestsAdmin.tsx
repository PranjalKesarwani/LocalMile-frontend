import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL, get_config } from "../../Url";
import RequestCard from "./RequestAdmin/RequestCard";


export type Requests = {
  activeSessions: string[];
  adminApproval: boolean;
  sellerName: string
  shopName: string;
  chosenCategories: string[];
  landmark: string;
  phone: string;
  pic: string;
  createdAt: string;
  updatedAt: string;
  pinCode: string;
  role: string;
  shopAddress: string;
  _id: string
}

export type TCategory = {
  message:string;
  pinCode:string;
  shopCategories:string[];
  _id:string;
  createdAt:string;
  updatedAt:string
}

const RequestsAdmin = () => {

  const marketAreaPinCodes = ['221507', '221508', '221509', '221510'];
  // const availableCategories = ['Cloths', 'Gifts', 'Goggles & Spectacles', 'Shoes', 'Matty'];
  const [requests, setRequests] = useState<Requests[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);




  const getAllRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/auth/get-seller-requests`, get_config);
      console.log(res.data);
      setRequests(res.data);

    } catch (error) {

    }
  }

  const availableCategoriess = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/pin/get-available-categories`, get_config);
      if (res.status === 200) {
        console.log(res.data);
        setAvailableCategories(()=>[...res.data.shopCategories]);
      }

    } catch (error) {
      console.log(error);
      alert('Internal server error!');
    }
  }

  useEffect(() => {
    getAllRequests();
  }, [])

  return (
    <div className="w-full h-full bg-white rounded-lg flex flex-col p-3  gap-3">
      <div className="w-full h-[8rem] ">


        <h1 className="text-4xl font-semibold text-gray-600">All Requests</h1>
        <hr />
        <div className=" w-full p-2  ">
          <ul className=" flex gap-2 justify-evenly text-xl">
            {
              marketAreaPinCodes.map((pin, idx) => {
                return (
                  <li key={idx} className="border-[1px] border-black rounded-full px-2 py-1 min-w-[12rem] text-center">{pin}</li>

                )
              })
            }

          </ul>
        </div>

        <hr />
        <div className=" w-full p-2  ">
          <button className="bg-red-600 text-white text-2xl px-2 py-1 rounded-md" onClick={()=>availableCategoriess()}>Fetch available categories(221507)</button>
        </div>


        <hr />
      </div>


      <div className="w-full h-[53rem] overflow-y-auto  space-y-5  overflow-hidden mt-3">
        {
          requests.map((request) => {
            return (
              <RequestCard
                key={request._id}
                request={request}
                availableCategories={availableCategories}
              />
            )
          })
        }


      </div>








    </div>
  )
}

export default RequestsAdmin
