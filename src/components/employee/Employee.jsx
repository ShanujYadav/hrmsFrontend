import React, { useState } from "react";
import logo from '../../assets/img/logo.png'
import { Routes, Route, useNavigate } from "react-router-dom";
import { EmpContextProvider } from "./EmpContext";
import EmpTopbar from "./EmpTopbar";
import EmpSidebar from "./EmpSidebar";
import EmpHome from "./empHome/EmpHome";
import Leave from "./leave/Leave";
import Profile from "./profile/Profile";
import SalerySlip from "./salery/SalerySlip"
import HolidayList from "./holiday/HolidayList";


export default function Employee() {
    const navigate=useNavigate()
    const [currentTab, setCurrentTab] = useState('Dashboard')
    return (
        <EmpContextProvider>
            <div x-data="setup()">
                <div class="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-stone-100 dark:bg-gray-700 text-black dark:text-white">
                    <EmpTopbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
                    <div class="fixed w-full flex items-center justify-between h-14 text-white z-10">
                        <div 
                        onClick={()=>navigate('/')}
                        class="flex items-center cursor-pointer justify-start md:justify-center pl-3 w-7 md:w-64 h-14 bg-white dark:    bg-gray-800 border-none">
                            <img src={logo} />
                        </div>
                        <div class="flex justify-between items-center h-14 bg-blue-800 dark:bg-gray-800 header-right">
                            <ul class="flex items-center">
                            </ul>
                        </div>
                    </div>
                    <EmpSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
                    <div class="h-full ml-14 mt-6 mb-10 md:ml-64">
                        <Routes>
                            <Route path="/" element={<EmpHome />} />
                            <Route path="/leave" element={<Leave />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/salarySlip" element={<SalerySlip />} />
                            <Route path="/holidaylist" element={<HolidayList />} />
                        </Routes>
                    </div>
                </div>
            </div >
        </EmpContextProvider>
    )
}
