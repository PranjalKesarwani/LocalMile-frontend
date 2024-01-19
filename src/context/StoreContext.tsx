import { createContext, useContext, useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import { BASE_SOCKET_URL } from "../Url/Url";

type TContext = {
//   socket: Socket | null;
//   setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
titleImgUrl:string

};

// const getSocket = () => {
//   return io(BASE_SOCKET_URL);
// };

const storeContext = createContext<TContext | null>(null);

const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
//   const [socket, setSocket] = useState<TContext['socket']>(null);
//   const [isChecked, setIsChecked] = useState<boolean>(false);
//   let dark = 'bg-[#0f1c2e]';
//   let light = 'bg-[#eceff8]';

        const titleImgUrl = 'src/assets/localMile.png'


//   useEffect(() => {
//     // const newSocket = getSocket();
//     // setSocket(newSocket);

//     // Cleanup function to disconnect the socket when the component unmounts
//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

  return (
    <storeContext.Provider value={{ titleImgUrl}}>
      {children}
    </storeContext.Provider>
  );
};

const useContextStore = () => {
  const context = useContext(storeContext);
  if (!context) {
    throw new Error("useStore must be used within a SocketProvider");
  }
  return context;
};

export { ContextProvider, useContextStore };
