import axios from 'axios';
import React, { useState } from 'react'
import { BASE_URL, post_config } from '../../../Url';

type TProps = {
    // handleAddCategory:(category: string) => void;
    // handleAcceptApproval:() => Promise<void>
    // selectedCategories:string[];
    // handleRemoveCategory:( idx: number) => void;
    availableCategories:string[]
}

const RequestCard = ({availableCategories}:TProps) => {

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleRemoveCategory = ( idx: number) => {


    selectedCategories.splice(idx, 1);
    setSelectedCategories((prev) => {
      return [...prev]
    });

  }

  const handleAddCategory = (category: string) => {
    for (let i = 0; i < selectedCategories.length; i++) {
      if (selectedCategories[i] === category) {
        alert('Category already added');
        return
      }
    }

    setSelectedCategories((prev) => {

      return [...prev, category] as string[]
    })
  }

  const handleAcceptApproval = async () => {

    if (selectedCategories.length === 0) {
      alert('Select atleast one category!');
      return;
    }
    try {
      const res = await axios.put(`${BASE_URL}/auth/seller-request-approval`,{selectedCategories},post_config);
      console.log(res.data);

    } catch (error) {

    }
  }


  return (
    <div className=" w-full p-2 flex flex-col gap-4 border-[1px] border-gray-400 rounded-md">

        <div className="p-1  flex text-[1.3rem] gap-4">
          <span className="  p-1">Pin code: <strong>221507</strong></span>
          <span className="  p-1">Phone: <strong>982520785</strong></span>
          <span className="  p-1">Seller Name: <strong>Pranjal Kesarwani</strong></span>
          <span className="  p-1">Shop Name: <strong>Hem Chandra Vastra Bhandar</strong></span>
        </div>
        <div className="p-1  flex text-[1.3rem] gap-4">
          <span className="  p-1">Shop Address: <strong>Sahson, Jhunsi Road, Prayagraj</strong></span>
          <span className="  p-1">Landmark: <strong>Near gol chauraha</strong></span>

        </div>
        <hr />
        <div className="p-1  flex flex-col text-[1.3rem] gap-4 ">
          <span className="  p-1"> <strong>Selected Categories</strong> </span>
          <ul className=" flex overflow-x-auto space-x-4 p-4 w-full  ">
            {
              selectedCategories.length === 0 ? <><div className="w-full text-5xl text-gray-400">Select atleast 1 category</div></>:(
                selectedCategories.map((category, idx) => {
                  return (
                    <div key={idx} className="border border-gray-300 min-w-[15rem] text-center p-2 rounded cursor-pointer flex justify-between bg-green-200 gap-5"><span className="">{category} </span><span className="   rounded-full hover:bg-red-700 hover:text-white w-[2rem] h-[2rem] flex items-center justify-center" onClick={() => handleRemoveCategory( idx)}><i className="fa-solid fa-xmark"></i></span></div>
  
                  )
                })
              )
           
            }
          </ul>

        </div>
        <hr />
        <div className=" w-full ">
          <h1 className="font-bold text-xl w-full">Available categories:</h1>
          <ul className=" flex overflow-x-auto space-x-4 p-4 w-full  ">
            {
              availableCategories.map((category, idx) => {
                return (
                  <div key={idx} className="border border-gray-300 min-w-[15rem] text-center p-2 rounded cursor-pointer" onClick={() => handleAddCategory(category)}>{category}</div>

                )
              })
            }

          </ul>
        </div>
        <hr />
        <div className="w-full flex justify-end">

        <button className="bg-green-600 text-white text-2xl py-2 w-[15rem] rounded-lg mr-8 mb-3" onClick={handleAcceptApproval}>Approve Request</button>
        </div>

      </div>
  )
}

export default RequestCard
