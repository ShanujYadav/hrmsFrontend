import { createSlice } from "@reduxjs/toolkit"
import { getEmpProfileData, getProfileData } from "../action/ProfileAction"

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
        address: '',
        education: '',
    }
}

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        getLogin: (state, action) => {
            state.userInfo.userId = 'snau@gmail.com'
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getEmpProfileData.fulfilled, (state, action) => {
            // console.log('action.payload---', action.payload)
            state.empInfo.gender = action.payload.user.gender
            state.empInfo.name = action.payload.user.name
            state.empInfo.phone = action.payload.user.phone
            state.empInfo.address = action.payload.user.address
            state.empInfo.DOB = action.payload.user.dateOfBirth
            state.empInfo.DOJ = action.payload.user.joiningDate 
            state.empInfo.email = action.payload.user.email
            state.empInfo.imgUrl = action.payload.user.img
            state.empInfo.role = action.payload.user.role
            state.empInfo.education = action.payload.user.education
        })
    }
})

export const { getLogin } = profileSlice.actions

export default profileSlice.reducer