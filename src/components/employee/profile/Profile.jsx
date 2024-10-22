import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { EmpContext } from '../EmpContext'
import { ApiCaller } from '../../utils/ApiCaller'

const Profile = (props) => {
    const [data, setData, profileDetails] = useContext(EmpContext)

    const [profileData, setProfileData] = useState(profileDetails)

    const navigate = useNavigate()
    const id = sessionStorage.getItem('id')
    const name = sessionStorage.getItem('name')
    const imgUrl = sessionStorage.getItem('img')
    const accessToken = sessionStorage.getItem('accessToken')
    const gender = sessionStorage.getItem('gender')
    const joiningDate = sessionStorage.getItem('joiningDate')
    const role = sessionStorage.getItem('role')
    const education = sessionStorage.getItem('education')
    const phone = sessionStorage.getItem('phone')
    const email = sessionStorage.getItem('email')
    const dateOfBirth = sessionStorage.getItem('dateOfBirth')

    useEffect(() => {
        if (!name || !id || !accessToken) {
            navigate('/')
            toast.error('Please Login First')
        }
    }, [])

    return (
        <div class="flex flex-col h-screen ">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                <div class="bg-white p-4 rounded-md">
                    <h2 class="block text-sm text-muted leading-6 text-black pb-2"><b className='text-blue-500'>PERSONAL </b> Details</h2>
                    <div class="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div>
                    <div class="max-w-2xl">
                        <div class="grid grid-cols-2 gap-x-10 gap-y-10 mx-4 sm:grid-cols-2">
                            <div>
                                <img
                                    // src="https://www.w3schools.com/howto/img_avatar.png"
                                    src={imgUrl}
                                    alt="Avatar"
                                    className="rounded-circle  h-20 w-20"
                                />
                            </div>
                            <div className='py-3'>
                                <label for="pan-card" class="block font-semibold text-sm leading-6 text-black">Name</label>
                                <h6 className='text-gray-600 text-sm'>{name}</h6>
                            </div>
                            <div className='py-3'>
                                <label for="pan-card" class="block font-semibold text-sm leading-6 text-black">Phone</label>
                                <h6 className='text-gray-600 text-sm'>{phone}</h6>
                            </div>
                            <div className='py-3'>
                                <label for="pan-card" class="block font-semibold text-sm leading-6 text-black">Email</label>
                                <h6 className='text-gray-600 text-sm'>{email}</h6>
                            </div>
                            <div className=''>
                                <label for="pan-card" class="block font-semibold text-sm leading-6 text-black">Gender</label>
                                <h6 className='text-gray-600 text-sm'>{gender}</h6>
                            </div>
                            <div className=''>
                                <label for="pan-card" class="block font-semibold text-sm leading-6 text-black">DOB</label>
                                <h6 className='text-gray-600 text-sm'>{dateOfBirth}</h6>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-4 rounded-md ">
                    <h2 class="block text-sm leading-6 text-muted pb-2"><b className='text-blue-500'>OTHER </b> Details</h2>
                    <div class="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div>
                    <div class="max-w-2xl">
                        <div class="grid grid-cols-2 gap-x-10 gap-y-10 mx-4 sm:grid-cols-2">
                            <div className='py-3'>
                                <label for="pan-card" class="block font-semibold text-sm leading-6 text-black">Education</label>
                                <h6 className='text-gray-600 text-sm'>{education}</h6>
                            </div>
                            <div className='py-3'>
                                <label for="pan-card" class="block font-semibold text-sm leading-6 text-black">Role</label>
                                <h6 className='text-gray-600 text-sm'>{role}</h6>
                            </div>
                            <div className='py-3'>
                                <label for="pan-card" class="block font-semibold text-sm leading-6 text-black">Date Of Joining</label>
                                <h6 className='text-gray-600 text-sm'>{joiningDate}</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Profile