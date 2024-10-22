import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    empInfo: {
        name: '',
        phone: '',
        gender: '',
        DOB: '',
        DOJ: '',
        email: '',
        imgUrl: '',
        role: '',
        email: '',
        address: '',
        education: '',
    }
}


export const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        getLogin: (state, action) => {
            state.userInfo.userId = action.payload 
        },
    },

    // extraReducers: (builder) => {
    //     builder.addCase(getEmpLogin.fulfilled, (state, action) => {
    //         console.log('action.payload---', action.payload)
    //         state.empInfo.phone = action.payload.user.phone
    //         state.empInfo.name = action.payload.user.name
    //     })
    // }
})

export const { getLogin } = homeSlice.actions
export default homeSlice.reducer