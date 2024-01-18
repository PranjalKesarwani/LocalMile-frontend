import { Link } from "react-router-dom"

const BuyerAuthPage = () => {
    return (
        <div className="w-screen h-screen flex flex-col gap-5 items-center justify-center ">
            <h1 className="text-center text-7xl text-black ">Buyer signup & Login Form</h1>

            <Link to="/buyer-landing">Go to Buyer Landing Page</Link>
            <Link to="/seller-auth">Others</Link>

        </div>
    )
}

export default BuyerAuthPage
