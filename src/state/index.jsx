import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "light",
    sidebarOpened: true,
    user: null,
    token: null,
};

export const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setSideBar: (state) => {
            state.sidebarOpened = state.sidebarOpened === true ? false : true;
        },
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
    },
});

export const { setMode, setSideBar, setLogin, setLogout } = globalSlice.actions;
// export const {  } = globalSlice.actions;

export default globalSlice.reducer;
