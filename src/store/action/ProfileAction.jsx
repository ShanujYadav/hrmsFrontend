import { createAsyncThunk } from "@reduxjs/toolkit"

export const getEmpProfileData = createAsyncThunk("getEmpProfileData", async (empData) => {
    console.log(empData.user)
    sessionStorage.setItem('accessToken', empData.accessToken)
    sessionStorage.setItem('name', empData.user.name)
    sessionStorage.setItem('id', empData.user._id)
    sessionStorage.setItem('role', empData.user.role)
    sessionStorage.setItem('img', empData.user.img)
    sessionStorage.setItem('education', empData.user.education)
    sessionStorage.setItem('email', empData.user.email)
    sessionStorage.setItem('joiningDate', empData.user.joiningDate)
    sessionStorage.setItem('address', empData.user.address)
    sessionStorage.setItem('dateOfBirth', empData.user.dateOfBirth)
    sessionStorage.setItem('gender', empData.user.gender)
    sessionStorage.setItem('phone', empData.user.phone)
    sessionStorage.setItem('pan', empData.user.pan)
    sessionStorage.setItem('pf', empData.user.pfNo)
    return empData
})