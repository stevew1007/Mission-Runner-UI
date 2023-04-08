import { createContext, useContext, useState } from 'react';
import ApiClient from '../ApiClient';

const globalContext = createContext();

const GlobalProvider = ({ children }) => {

    const [mode, setMode] = useState('light');
    const toggleMode = () => {
        setMode(mode === 'light' ? 'dark' : 'light');
    };

    const [sidebarOpened, setSidebarOpened] = useState(true);
    const toggleSidebar = () => {
        setSidebarOpened(sidebarOpened === true ? false : true);
    };

    const api = new ApiClient();

    return (
        <globalContext.Provider value={{ mode, toggleMode, sidebarOpened, toggleSidebar, api }}>
            {children}
        </globalContext.Provider>
    );
}

export default GlobalProvider

export function useGlobal() {
    return useContext(globalContext)
}