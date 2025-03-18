import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store/store.tsx";
import { ContextProvider } from "./context/StoreContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ContextProvider>
        <ThemeProvider>
          <App />
          <ToastContainer
            theme={"dark"} // Match app theme
            position="top-right" // Default position
            autoClose={5000} // Close after 5 seconds
            hideProgressBar={false} // Show progress bar
            closeOnClick // Allow closing on click
            pauseOnHover // Pause timer on hover
            draggable // Allow dragging
          />
        </ThemeProvider>
      </ContextProvider>
    </Provider>
  </React.StrictMode>
);
