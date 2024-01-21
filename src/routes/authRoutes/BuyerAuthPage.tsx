import { useState } from "react";
import SignupBuyer from "../../components/buyer/SignupBuyer";
import LoginBuyer from "../../components/buyer/LoginBuyer";
import Modal from "../../shared/Modal";

const BuyerAuthPage = () => {
    const [toggleAuth, setToggleAuth] = useState<boolean>(true);

    return (
        <>


            {

                toggleAuth ? <>

                  
                       
                 

                    <SignupBuyer setToggleAuth={setToggleAuth} />

                </> : <>


                    <LoginBuyer setToggleAuth={setToggleAuth} />

                </>
            }








        </>
    )
}

export default BuyerAuthPage
