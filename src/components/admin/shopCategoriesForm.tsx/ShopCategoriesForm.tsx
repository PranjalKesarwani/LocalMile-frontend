import axios from "axios";
import { useState } from "react"
import { BASE_URL, post_config } from "../../../Url";

type TCategoryForm = {
    pincode: string;
    category: string;
    message?: string;
}

const obj = {
    pincode: "",
    category: "",
    message: ""
}

const ShopCategoriesForm = () => {

    const [categoryForm, setCategoryForm] = useState<TCategoryForm>(obj);

    const handleCategoryForm = async () => {
        console.log(categoryForm);
        try {

            const res = await axios.post(`${BASE_URL}/pin/add-shop-category`, categoryForm, post_config);
            if (res.status === 200) {
                console.log(res.data)
            }
            if (res.status === 201) {
                console.log(res.data);
            }

        } catch (error) {
            console.log(error);
            alert('Internal server error!');
        }
    }
    return (
        <div className="w-full h-full bg-white rounded-lg ">

            <h1 className=' text-3xl h-[7%] font-semibold text-gray-700 p-2'>Manage Shop Categories</h1>
            <div className=" w-full h-[93%]  flex items-center justify-center flex-col gap-5">


                <select className='text-2xl cursor-pointer' onChange={(e) => { setCategoryForm({ ...categoryForm, pincode: e.target.value }) }} >
                    <option value="">Select Zip Code</option>

                    <option >
                        221507
                    </option>

                </select>
                <label htmlFor="addCategory" id='addCategory' className='text-2xl'>Category: <input id='addCategory' type="text" className='rounded-md' value={categoryForm?.category} onChange={(e) => { setCategoryForm({ ...categoryForm, category: e.target.value }) }} /></label>
                <p>If you want to change the title message on landing page?</p>
                <label htmlFor="message" id='message' className='text-2xl'>Message: <input id='message' type="text" className='rounded-md' value={categoryForm?.message} onChange={(e) => { setCategoryForm({ ...categoryForm, message: e.target.value }) }} /></label>
                <button className='px-2 py-1 bg-violet-700 text-white text-xl rounded-md shadow-md ' onClick={handleCategoryForm}>Add This Category</button>
            </div>
        </div>
    )
}

export default ShopCategoriesForm


