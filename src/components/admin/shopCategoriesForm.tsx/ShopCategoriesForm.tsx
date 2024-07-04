import axios from "axios";
import { useState } from "react"
import { BASE_URL, post_config } from "../../../Url";

type TCategoryForm = {
    category: string;
}

const obj = {
    category: "",
}

const ShopCategoriesForm = () => {

    const [categoryForm, setCategoryForm] = useState<TCategoryForm>(obj);

    const handleCategoryForm = async () => {
        console.log(categoryForm);
        try {

            const res = await axios.post(`${BASE_URL}/pin/add-shop-category`, categoryForm);
            if (res.status === 200) {
                console.log(res.data);
                alert("Added")
            }
            if (res.status === 201) {
                console.log(res.data);
                alert("Added");
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
                <label htmlFor="addCategory" id='addCategory' className='text-2xl'>Category: <input id='addCategory' type="text" className='rounded-md' placeholder="Enter Category Name" value={categoryForm?.category} onChange={(e) => { setCategoryForm({ ...categoryForm, category: e.target.value }) }} /></label>
              
                <button className='px-3 py-1 bg-violet-700  text-white text-2xl rounded-md shadow-md ' onClick={handleCategoryForm}>Add This Category</button>
            </div>
        </div>
    )
}

export default ShopCategoriesForm


