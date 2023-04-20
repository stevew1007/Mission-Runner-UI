import { createContext, useContext, useState, useEffect } from "react";
import { useGlobal } from "./GlobalProvider";
import PropTypes from 'prop-types';

const UserContext = createContext();

export default function UserProvider({ children }) {
    const [user, setUser] = useState();
    const [updateUser, setUpdateUser] = useState(false);
    const {api} = useGlobal();

    useEffect(() => {
        (async () => {
            if (api.isAuthenticated()) {
                const response = await api.get("/me");
                setUser(response.ok ? response.body : null);
            } else {
                setUser(null);
            }
        })();
    }, [api, updateUser]);

    const toggleUpdateUser = () => {
        setUpdateUser(updateUser ? false : true);
    };

    const login = async (username, password) => {
        const result = await api.login(username, password);
        if (result === 'ok') {
            const response = await api.get("/me");
            setUser(response.ok ? {...response.body, background:'#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6)} : null);
            return response.ok;
        }
        return result;
    };

    const logout = async () => {
        await api.logout();
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, login, logout, toggleUpdateUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}

UserProvider.propTypes = {
    children: PropTypes.any
}
