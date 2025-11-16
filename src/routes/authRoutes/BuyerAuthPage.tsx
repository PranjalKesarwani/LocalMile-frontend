import { useState } from "react";
import SignupBuyer from "../../components/buyer/SignupBuyer";
import LoginBuyer from "../../components/buyer/LoginBuyer";

const BuyerAuthPage = () => {
  const [toggleAuth, setToggleAuth] = useState<boolean>(true);

  return (
    <>
      {toggleAuth ? (
        <>
          <SignupBuyer setToggleAuth={setToggleAuth} />
        </>
      ) : (
        <>
          <LoginBuyer setToggleAuth={setToggleAuth} />
        </>
      )}
    </>
  );
};

export default BuyerAuthPage;
