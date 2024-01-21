// import React from 'react'
import SignupSeller from '../../components/seller/SignupSeller';
import { useState } from 'react';
import LoginSeller from '../../components/seller/LoginSeller';

const SellerAuthPage = () => {
    const [toggleAuth, setToggleAuth] = useState<boolean>(false);

    return (
        <>


            {

                toggleAuth ? <>
                    <SignupSeller setToggleAuth={setToggleAuth} />
                </> : <>
                    <LoginSeller setToggleAuth={setToggleAuth} />

                </>
            }

        </>
    )
}

export default SellerAuthPage
