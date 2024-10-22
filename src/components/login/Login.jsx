import React, { useEffect, useState } from 'react'
import logo from '../../assets/img/logo.png'
import altlogo from '../../assets/img/ANlogo.png'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { ApiCaller } from '../utils/ApiCaller';
import { getEmpProfileData } from '../../store/action/ProfileAction';


const Login = () => {
    const adminEmail = 'admin@gmail.com'
    const adminPass = 'admin'

    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    useEffect(() => {
        sessionStorage.clear()
    }, [])

    const [error, setError] = useState({
        email: false,
        password: false,
    })
    
    const [data, setData] = useState({
        email: "",
        password: "",
    })

    const onChangeEmailHandelar = (enterdMail) => {
        setData({ ...data, email: enterdMail })
    }
    const onChangePassHandelar = (enterdPass) => {
        setData({ ...data, password: enterdPass })
    }



    const onClickSubmit = async () => {
        try {
            if (!data.email || !data.password) {
                toast.error('All Fields Are Required !')
                return
            }
            if (data.email == adminEmail && data.password == adminPass) {
                navigate('/adminDashboard')
                sessionStorage.setItem('email', data.email)
                sessionStorage.setItem('user', 'Admin')
                toast.success('Admin Logged In !')
                return
            }
            else {
                let headers = {
                    "Content-Type": "application/json"
                }
                let body = JSON.stringify({
                    email: data.email,
                    password: data.password
                })
                let response = await ApiCaller(body, headers, '/emp/login')
                if (response.statusCode == '000') {
                    dispatch(getEmpProfileData(response.data))
                    toast.success(`Welcome 🤗 ${response.data.user.name}`)
                    navigate('/empDashboard')
                }
                else (
                    toast.error(response.message)
                )
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <div class="flex h-screen">
            <div class="hidden lg:flex items-center justify-center flex-1 bg-white text-black">
                <div class="">
                    <img src={altlogo} alt="altaneologo" />
                </div>
            </div>
            <div class="w-full bg-gray-100 lg:w-1/2 flex items-center justify-center">
                <div class="max-w-md w-full p-6">
                    <img class="w-full items-center mb-6" src={logo} alt='companylogo' />
                    <h1 class="text-3xl font-bold mb-6 text-black text-center">LOGIN</h1>
                    <div class="space-y-4">
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                onChange={(e) => onChangeEmailHandelar(e.target.value)}
                                value={data.email}
                                type="text"
                                placeholder='Email'
                                id="email"
                                name="email"
                                class="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                            />
                        </div>
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                placeholder='Password'
                                id="password"
                                name="password"
                                onChange={(e) => onChangePassHandelar(e.target.value)}
                                class="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300" />
                        </div>
                        <div>
                            <button
                                type="submit"
                                onClick={onClickSubmit}
                                class="w-full bg-blue-400 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 mt-6">Login</button>
                        </div>
                        <div class="text-center">
                            <span>Don't have an account? <a href='/register' class='text-blue-800'>Register</a></span>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
    )
}
export default Login