import React, { useState } from "react";
import logo from '../../assets/img/logo.png'
import { Routes, Route } from "react-router-dom";
import { AdminContextProvider } from "./AdminContext";
import AdminSidebar from "./AdminSidebar";
import AdminHome from "./adminHome/AdminHome";
import AdminTopbar from "./AdminTopbar";
import EmployeeList from "./employee/EmployeeList";
import Notification from "./notifications/Notification"
import Salery from "./salery/Salery";

export default function Admin() {
    const [currentTab, setCurrentTab] = useState('Dashboard')
    const [item, setItem] = useState(null)
    return (
        <AdminContextProvider>
            <div x-data="setup()">
                <div class="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-stone-100 dark:bg-gray-700 text-black dark:text-white">
                    <AdminTopbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
                    <div class="fixed w-full flex items-center justify-between h-14 text-white z-10">
                        <div class="flex items-center justify-start md:justify-center pl-3 w-7 md:w-64 h-14 bg-stone-800 dark:bg-gray-800 border-none">
                            <img src={logo} />
                        </div>
                        <div class="flex justify-between items-center h-14 bg-blue-800 dark:bg-gray-800 header-right">
                            <ul class="flex items-center">
                            </ul>
                        </div>
                    </div>
                    <AdminSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
                    <div class="h-full ml-14 mt-6 mb-10 md:ml-64">
                        <Routes>
                            <Route path="/" element={<AdminHome />} />
                            <Route path="/employees" element={<EmployeeList item={item} setItem={setItem} />} />
                            <Route path="/notifications" element={<Notification />} />
                            <Route path="/payslip" element={<Salery />} />
                        </Routes>
                    </div>
                </div>
            </div >
        </AdminContextProvider>
    )
}
