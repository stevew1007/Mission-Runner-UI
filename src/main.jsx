import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
// import { configureStore } from "@reduxjs/toolkit";
// import globalReducer from "./state";
// import { Provider } from "react-redux";
import GlobalProvider from "./contexts/GlobalProvider";
import UserProvider from "./contexts/UserProvider";
import FlashProvider from "./contexts/FlashProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <GlobalProvider>
            <UserProvider>
                <FlashProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </FlashProvider>
            </UserProvider>
        </GlobalProvider>
    </React.StrictMode>
);
