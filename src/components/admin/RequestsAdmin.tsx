import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../../Url";
import RequestCard from "./RequestAdmin/RequestCard";

const RequestsAdmin = () => {

  const marketAreaPinCodes = ['221507', '221508', '221509', '221510'];
  const availableCategories = ['Cloths', 'Gifts', 'Goggles & Spectacles', 'Shoes', 'Matty'];
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);


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

  const handleRemoveCategory = (category: string, idx: number) => {

    console.log(category, idx)
    selectedCategories.splice(idx, 1);
    setSelectedCategories((prev) => {
      return [...prev]
    });

  }

  const handleAccpetApproval = async () => {

    if (selectedCategories.length === 0) {
      alert('Select atleast one category!');
      return;
    }
    try {
      const res = await axios.put(`${BASE_URL}/auth/seller-request-approval`);

    } catch (error) {

    }
  }

  return (
    <div className="w-full h-full bg-white rounded-lg flex flex-col p-3  gap-3">
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
      {/* <div className=" w-full p-2 text-xl flex flex-col gap-2 mt-2 ">
        <h1 className=" ml-4">Available shop categories for 221507</h1>
        <ul className=" flex overflow-x-auto space-x-4 p-4">
          {
            availableCategories.map((category, idx) => {
              return (
                <div key={idx} className="border border-gray-300 min-w-[15rem] text-center p-2 rounded">{category}</div>

              )
            })
          }



        </ul>

      </div> */}

      <hr />

      <div className="w-full h-full overflow-y-auto flex flex-col space-y-5">
        <RequestCard
          handleAddCategory={handleAddCategory}
          handleAcceptApproval={handleAccpetApproval}
          selectedCategories={selectedCategories}
          handleRemoveCategory={handleRemoveCategory}
          availableCategories={availableCategories}
        />
     
      </div>





    </div>
  )
}

export default RequestsAdmin
