import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoading: true,
        forgotFactor: '',
        currentUser: {},
    },
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload
        },
        removeCurrentUser: (state, action) => {
            state.currentUser = {}
        },
        editUser: (state, action) => {
            state.currentUser = action.payload
        },
        setForgotFactor: (state, action) => {
            state.forgotFactor = action.payload
        },
    },
})