import React, { useState } from 'react';
import logo from '../../assets/img/logo.png';
import { ApiCaller } from '../utils/ApiCaller';
import Modal from 'react-modal';
import profileDemo from '../../assets/img/profileImgDemo.jpg';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const todayDate = new Date()

const Register = () => {
    const navigate = useNavigate()
    const [image, setIamage] = useState(profileDemo)
    const [openModal, setOpenModal] = useState(false)

    const [data, setData] = useState({
        name: '',
        email: '',
        role: '',
        dob: '',
        mobile: '',
        password: '',
        photo: null,
        doj: '',
        address: '',
        education: '',
        gender: '',
        pan: '',
        pfNo: ''
    })

    const compareDates = (date1, date2) => {
        const parsedDate1 = new Date(date1);
        const [year, month, day] = date2.split('-').map(Number)
        const parsedDate2 = new Date(year, month - 1, day);
        if (parsedDate1.getTime() < parsedDate2.getTime()) {
            return false
        } else if (parsedDate1.getTime() > parsedDate2.getTime()) {
            return true
        } else {
            return false
        }
    }


    const previewImage = (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setIamage(reader.result)
                setData({ ...data, photo: file });
            }
            reader.readAsDataURL(file);
        }
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }


    const onClickSubmit = async (e) => {
        e.preventDefault()
        const validDob = compareDates(todayDate, data.dob)
        const validDoj = compareDates(todayDate, data.doj)

        if (!data.address || !data.dob || !data.doj || !data.education || !data.email || !data.gender || !data.mobile || !data.name || !data.password || !data.photo || !data.role || !data.pan) {
            toast.error('All Fields are Required !')
            return
        }
        if (!validDob) {
            toast.error('Please Selcet a Valid Date of Birth !')
            return
        }
        if (!validDoj) {
            toast.error('Please Selcet a Valid Date of Joining !')
            return
        }
        setOpenModal(true)
        try {
            const formData = new FormData()
            formData.append('name', data.name);
            formData.append('phone', data.mobile);
            formData.append('role', data.role);
            formData.append('dateOfBirth', data.dob);
            formData.append('img', data.photo);
            formData.append('joiningDate', data.doj);
            formData.append('email', data.email);
            formData.append('address', data.address);
            formData.append('password', data.password);
            formData.append('education', data.education);
            formData.append('gender', data.gender);
            formData.append('pan', data.pan.toUpperCase());
            formData.append('pfNo', data.pfNo)
            let headers = {}

            console.log('photo---', data.photo)
            let response = await ApiCaller(formData, headers, '/emp/reqForRegister')
            setOpenModal(false)
            if (response.statusCode == '000') {
                toast.success(response.message)
                navigate('/')
            }
            else (
                toast.error(response.message)
            )
        } catch (error) {
            console.log(error)
        }
    }


    const onCloseModal = () => {
        setOpenModal(false)
    }


    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    }

    return (
        <div className="container mx-auto p-3">
            <div className="max-w-4xl mx-auto mb-0 font-[sans-serif] text-[#333] p-6">
                <div className="text-center mb-8 ">
                    <a href="javascript:void(0)">
                        <img src={logo} alt="logo" className="w-62 h-15 inline-block" />
                    </a>
                    <h4 className="text-lg font-semibold mt-3">Sign up into your account</h4>
                </div>
            </div>
            <div className="p-4 rounded-xl">
                <form>
                    <div className="grid sm:grid-cols-3 gap-y-7 gap-x-12">
                        <div className="flex flex-col items-center mt-6">
                            <label className="text-sm font-semibold mb-2 block">Upload Photograph</label>
                            <div className="relative w-40 h-40 rounded-full border-2 border-gray-300 overflow-hidden">
                                <img id="photo-preview" src={image} alt='Upload Image' className="w-full h-full object-cover" />
                                <input
                                    id="photo-input"
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={previewImage}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Accepts jpg,.png,.jpeg up to 10MB.</p>
                        </div>

                        <div>
                            <label className="text-sm mb-2 block mt-4 font-semibold">Full Name </label>
                            <input
                                name="name"
                                type="text"
                                className="bg-gray-100 w-full text-muted px-4 py-3.5 rounded-md outline-blue-500"
                                placeholder="Enter name"
                                value={data.name}
                                onChange={handleChange}
                            />
                            <label className="text-sm mb-2 block mt-4 font-semibold">Email</label>
                            <input
                                name="email"
                                type="email"
                                className="bg-gray-100 w-full text-muted px-4 py-3.5 rounded-md outline-blue-500"
                                placeholder="Enter your email"
                                value={data.email}
                                onChange={handleChange}
                            />
                            <label className="text-sm mb-2 block mt-4 font-semibold">Mobile No.</label>
                            <input
                                name="mobile"
                                type="tel"
                                max={10}
                                maxLength={10}
                                className="bg-gray-100 w-full text-muted px-4 py-3.5 rounded-md outline-blue-500"
                                placeholder="Enter mobile number"
                                value={data.mobile}
                                onChange={handleChange}
                            />
                            <label className="text-sm mb-2 block mt-4 font-semibold">Role</label>
                            <input
                                name="role"
                                type="text"
                                className="bg-gray-100 w-full text-muted px-4 py-3.5 rounded-md outline-blue-500"
                                placeholder="Enter your role"
                                value={data.role}
                                onChange={handleChange}
                            />
                            <label className="text-sm mb-2 block mt-4 font-semibold">PAN No.</label>
                            <input
                                name="pan"
                                type="text"
                                className="bg-gray-100 w-full uppercase text-muted px-4 py-3.5 rounded-md outline-blue-500"
                                placeholder="Enter PAN No"
                                value={data.pan}
                                onChange={handleChange}
                            />
                            <label className="text-sm mb-2 block mt-4 font-semibold">Education</label>
                            <select
                                name="education"
                                type="text"
                                className="bg-gray-100 w-full text-muted px-4 py-3.5 rounded-md outline-blue-500"
                                value={data.education}
                                onChange={handleChange}>
                                <option value="" className='text-muted'>Select Education</option>
                                <option value="B.Tech">B.Tech/BE</option>
                                <option value="BBA">BBA</option>
                                <option value="MBA">MBA</option>
                                <option value="B.Com">B.Com</option>
                                <option value="B.sc">B.Sc</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm mb-2 block mt-4 font-semibold">Date of Birth</label>
                            <input
                                name="dob"
                                type="date"
                                className="bg-gray-100 w-full text-muted px-4 py-3.5 rounded-md outline-blue-500"
                                value={data.dob}
                                onChange={handleChange}
                            />
                            <label className="text-sm mb-2 block mt-4 font-semibold">Date of Joining</label>
                            <input
                                name="doj"
                                type="date"
                                className="bg-gray-100 w-full text-muted px-4 py-3.5 rounded-md outline-blue-500"
                                value={data.doj}
                                onChange={handleChange}
                            />
                            <label className="text-sm mb-2 block mt-4 font-semibold">Password</label>
                            <input
                                name="password"
                                type="password"
                                className="bg-gray-100 w-full text-muted px-4 py-3.5 rounded-md outline-blue-500"
                                placeholder="Enter password"
                                value={data.password}
                                onChange={handleChange}

                            />
                            <label className="text-sm mb-2 block mt-4 font-semibold">PF No</label>
                            <input
                                name="pfNo"
                                type="text"
                                className="bg-gray-100 w-full text-muted px-4 py-3.5 rounded-md outline-blue-500"
                                placeholder="Enter PF No"
                                value={data.pfNo}
                                onChange={handleChange}

                            />
                            <label className="text-sm mb-2 block mt-4 font-semibold">Address</label>
                            <input
                                name="address"
                                type="text"
                                className="bg-gray-100 w-full text-muted px-4 py-3.5 rounded-md outline-blue-500"
                                placeholder="Enter your address"
                                value={data.address}
                                onChange={handleChange}
                            />
                            <label className="text-sm mb-2 block mt-4 font-semibold">Gender</label>
                            <select
                                name="gender"
                                type="text"
                                className="bg-gray-100 w-full text-muted px-4 py-3.5 rounded-md outline-blue-500"
                                value={data.gender}
                                onChange={handleChange}>
                                <option value="" className='text-muted'>Select Gender</option>
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-10 text-center">
                        <button
                            type="button"
                            onClick={onClickSubmit}
                            className="min-w-[150px] py-3 px-4 text-sm font-semibold rounded text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                        >
                            Sign up
                        </button>
                    </div>
                </form>
            </div>

            <div>
                <Modal
                    isOpen={openModal}
                    onRequestClose={onCloseModal}
                    style={customStyles}
                    contentLabel="Example Modal">
                    <div class="text-center p-6 bg-white rounded-lg ">
                        <div class="w-full flex flex-col items-center justify-center gap-2">
                            <div class="w-full gap-x-2 flex justify-center items-center">
                                <div
                                    class="w-5 bg-[#d991c2] animate-pulse h-5 rounded-full animate-bounce"
                                ></div>
                                <div
                                    class="w-5 animate-pulse h-5 bg-[#9869b8] rounded-full animate-bounce"
                                ></div>
                                <div
                                    class="w-5 h-5 animate-pulse bg-[#6756cc] rounded-full animate-bounce"
                                ></div>
                            </div>
                            <div class="mt-2 text-center text-gray-700">Please wait</div>
                        </div>
                    </div>
                </Modal>
            </div>

        </div>
    )
}

export default Register;