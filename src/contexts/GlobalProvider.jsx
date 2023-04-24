import { createContext, useContext, useState, useEffect } from "react";
import ApiClient from "../ApiClient";
import PropTypes from "prop-types";

const globalContext = createContext();

const GlobalProvider = ({ children }) => {
    const [mode, setMode] = useState("light");
    const toggleMode = () => {
        setMode(mode === "light" ? "dark" : "light");
    };

    const [sidebarOpened, setSidebarOpened] = useState(true);
    const toggleSidebar = () => {
        setSidebarOpened(sidebarOpened === true ? false : true);
    };

    const api = new ApiClient();

    const [missions, setMissions] = useState();

    return (
        <globalContext.Provider
            value={{
                mode,
                toggleMode,
                sidebarOpened,
                toggleSidebar,
                api,
                missions,
                setMissions
            }}
        >
            {children}
        </globalContext.Provider>
    );
};

export default GlobalProvider;

export function useGlobal() {
    return useContext(globalContext);
}

GlobalProvider.propTypes = {
    children: PropTypes.any,
};
