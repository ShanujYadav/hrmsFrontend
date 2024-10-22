import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { ApiCaller } from '../../utils/ApiCaller';
import Modal from 'react-modal';
import { RxCross2 } from "react-icons/rx";


const Salery = () => {
    const [openModal, setOpenModal] = useState(false)
    const [empList, setEmpList] = useState([])
    const [selectedEmp, setSelectEmp] = useState([])

    const initialState = {
        id: '',
        year: '',
        month: '',
        workingDays: '',
        leaveDays: '',
        absence: '',

        baseSalery: '',
        hra: '',
        allowances: '',
        otherEarnings: '',

        incomeTax: '',
        pf: '',
        otherDeductions: '',
    }

    const [data, setData] = useState(initialState)

    const onCloseModal = () => {
        setOpenModal(false)
        setData(initialState)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
    }


    const onClickSave = async () => {
        if (!data.id || !data.year || !data.month || !data.workingDays || !data.leaveDays || !data.absence || !data.baseSalery || !data.hra || !data.allowances || !data.otherEarnings || !data.incomeTax || !data.pf || !data.otherDeductions) {
            toast.error('Fill all Feilds !')
            return
        }

        // if (data.some(field => !data[field])) {
        //     toast.error('Fill all Feilds !')
        //     return
        // }

        else {
            try {
                let headers = {
                    "Content-Type": "application/json",
                    "userAgent": "altaNeo"
                }

                let body = JSON.stringify({
                    employeeId: data.id,
                    year: data.year,
                    month: data.month,
                    workingDays: data.workingDays,
                    leaveDays: data.leaveDays,
                    absenceDays: data.absence,
                    baseSalary: data.baseSalery,
                    hra: data.hra,
                    allowance: data.allowances,
                    otherEarnings: data.otherEarnings,
                    incomeTax: data.incomeTax,
                    pf: data.pf,
                    otherDeductions: data.otherDeductions
                })

                let response = await ApiCaller(body, headers, '/salary/addSalary')
                if (response.statusCode == '000') {
                    setOpenModal(false)
                    toast.success(response.message)
                    setData(initialState)
                }
                else (
                    toast.error(response.message)
                )
            } catch (error) {
                console.log('error--', error)
            }
        }
    }


    const takeOnlyNumbers = (e) => {
        const name = e.target.name
        const value = e.target.value
        setData({ ...data, [name]: value })
    }



    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            setEmpList([])
            let headers = {};
            let body = {};
            try {
                let response = await ApiCaller(body, headers, '/emp/empList')
                if (isMounted && response.statusCode === '000') {
                    setEmpList(response.data);
                } else {
                    setEmpList([]);
                }
            } catch (e) {
                if (isMounted) {
                    setEmpList([]);
                }
                console.log(e);
            }
        }
        fetchData()
        return () => {
            isMounted = false;
        }
    }, [])


    const onClickMakeSlip = (emp) => {
        setOpenModal(true)
        setSelectEmp(emp)
        setData({ ...data, id: emp._id })
        // console.log(emp)
    }



    return (
        <>
            <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
                <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-4 font-medium text-gray-900">Name</th>
                            <th scope="col" class="px-6 py-4 font-medium text-gray-900">Phone</th>
                            <th scope="col" class="px-6 py-4 font-medium text-gray-900">Role</th>
                            <th scope="col" class="px-6 py-4 font-medium text-gray-900">Action</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 border-t border-gray-100">
                        {empList.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-4 py-3 text-center text-sm">
                                    No employees found
                                </td>
                            </tr>
                        ) : (
                            empList.map((emp, index) => (
                                <tr key={index} class="">
                                    <th class="flex gap-3 px-6 py-3 font-normal text-gray-900">
                                        <div class="relative h-10 w-10">
                                            <img
                                                class="h-full w-full rounded-full object-cover object-center"
                                                src={emp.img}
                                                alt=""
                                            />
                                        </div>
                                        <div class="text-sm">
                                            <div class="font-medium pt-2 text-gray-700">{emp.name}</div>
                                            <div class="text-gray-400">
                                            </div>
                                        </div>
                                    </th>
                                    <td class="px-6 py-4">
                                        {emp.phone}
                                    </td>
                                    <td class="px-6 py-4">
                                        <span
                                            class="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                                            {emp.role}
                                        </span>
                                    </td>
                                    <td class="">
                                        <button
                                            type="button"
                                            onClick={() => onClickMakeSlip(emp)}
                                            className="min-w-[100px] py-2 px-2 text-sm font-semibold rounded text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                                        >Make Slip
                                        </button>
                                    </td>
                                </tr>
                            )))}
                    </tbody>
                </table>
            </div>


            <Modal
                isOpen={openModal}
                onRequestClose={onCloseModal}
                contentLabel="Example Modal"
                className="fixed right-0 top-0 h-full w-11/12 bg-white shadow-xl"
            >
                <div className="flex justify-center h-screen w-screen items-center ">
                    <div className="flex flex-col w-full sm:w-4/5 lg:w-3/4 max-w-7xl mx-auto rounded-lg border border-gray-300 shadow-xl">
                        <div className="flex items-center justify-between px-6 py-3 font-normal text-gray-900 bg-white">
                            <div className="flex gap-3">
                                <div className="relative h-10 w-10">
                                    <img
                                        className="h-full w-full rounded-full object-cover object-center"
                                        src={selectedEmp.img}
                                        alt={selectedEmp.name}
                                    />
                                </div>
                                <div className="text-sm">
                                    <div className="font-medium pt-2 text-gray-700">{selectedEmp.name}</div>
                                </div>
                            </div>
                            <RxCross2
                                size={20}
                                className="cursor-pointer"
                                onClick={onCloseModal}
                            />
                        </div>

                        <div className="grid sm:grid-cols-4 gap-y-4 gap-x-12 p-4 bg-gray-50">
                            <div>
                                <label className="text-xs mb-2 block mt-4 font-medium">Year</label>
                                <select
                                    name="year"
                                    type="text"
                                    className="bg-white w-full border-2 border-gray-400 text-muted px-2 py-1 rounded-md outline-blue-500"
                                    value={data.year}
                                    onChange={handleChange}
                                >
                                    <option value="" className='text-muted'>Select Year</option>
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs mb-2 block mt-4 font-semibold">Month</label>
                                <select
                                    name="month"
                                    type="text"
                                    className="bg-white w-full border-2 border-gray-400 px-2 py-1 rounded-md outline-blue-500"
                                    value={data.month}
                                    onChange={handleChange}>
                                    <option value="" className='text-muted'>Select Month</option>
                                    <option value="January">January</option>
                                    <option value="February">February</option>
                                    <option value="March">March</option>
                                    <option value="April">April</option>
                                    <option value="May">May</option>
                                    <option value="June">June</option>
                                    <option value="July">July</option>
                                    <option value="August">August</option>
                                    <option value="September">September</option>
                                    <option value="October">October</option>
                                    <option value="November">November</option>
                                    <option value="December">December</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs mb-2 block mt-4 font-semibold">Working Days</label>
                                <input
                                    onChange={takeOnlyNumbers}
                                    value={data.workingDays}
                                    type="text"
                                    placeholder='Working Day'
                                    name="workingDays"
                                    className="bg-white w-full border-2 border-gray-400 text-muted px-2 py-1 rounded-md outline-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs mb-2 block mt-4 font-semibold">Leave Days</label>
                                <input
                                    onChange={takeOnlyNumbers}
                                    value={data.leaveDays}
                                    type="text"
                                    placeholder='Leave Days'
                                    name="leaveDays"
                                    className="bg-white w-full border-2 border-gray-400 text-muted px-2 py-1 rounded-md outline-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs mb-2 block mt-4 font-semibold">Absence Days</label>
                                <input
                                    onChange={takeOnlyNumbers}
                                    value={data.absence}
                                    type="text"
                                    placeholder='Absence Day'
                                    name="absence"
                                    className="bg-white w-full border-2 border-gray-400 text-muted px-2 py-1 rounded-md outline-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs mb-2 block mt-4 font-semibold">Base Salary</label>
                                <input
                                    onChange={takeOnlyNumbers}
                                    value={data.baseSalery}
                                    type="text"
                                    placeholder='Base Salary'
                                    name="baseSalery"
                                    className="bg-white w-full border-2 border-gray-400 text-muted px-2 py-1 rounded-md outline-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs mb-2 block mt-4 font-semibold">Allowances</label>
                                <input
                                    onChange={takeOnlyNumbers}
                                    value={data.allowances}
                                    type="text"
                                    placeholder='Allowances'
                                    name="allowances"
                                    className="bg-white w-full border-2 border-gray-400 text-muted px-2 py-1 rounded-md outline-blue-500" />
                            </div>
                            <div>
                                <label className="text-xs mb-2 block mt-4 font-semibold">HRA</label>
                                <input
                                    onChange={takeOnlyNumbers}
                                    value={data.hra}
                                    type="text"
                                    placeholder='HRA'
                                    name="hra"
                                    className="bg-white w-full border-2 border-gray-400 text-muted px-2 py-1 rounded-md outline-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs mb-2 block mt-4 font-semibold">Other Earnings</label>
                                <input
                                    onChange={takeOnlyNumbers}
                                    value={data.otherEarnings}
                                    type="text"
                                    placeholder='Other Earnings'
                                    name="otherEarnings"
                                    className="bg-white w-full border-2 border-gray-400 text-muted px-2 py-1 rounded-md outline-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs mb-2 block mt-4 font-semibold">Income Tax</label>
                                <input
                                    onChange={takeOnlyNumbers}
                                    value={data.incomeTax}
                                    type="text"
                                    placeholder='Income Tax'
                                    name="incomeTax"
                                    className="bg-white w-full border-2 border-gray-400 text-muted px-2 py-1 rounded-md outline-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs mb-2 block mt-4 font-semibold">PF</label>
                                <input
                                    onChange={takeOnlyNumbers}
                                    value={data.pf}
                                    type="text"
                                    placeholder='Enter PF'
                                    name="pf"
                                    className="bg-white w-full border-2 border-gray-400 text-muted px-2 py-1 rounded-md outline-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs mb-2 block mt-4 font-semibold">Other Deductions</label>
                                <input
                                    onChange={takeOnlyNumbers}
                                    value={data.otherDeductions}
                                    type="text"
                                    placeholder='Other Deductions'
                                    name="otherDeductions"
                                    className="bg-white w-full border-2 border-gray-400 text-muted px-2 py-1 rounded-md outline-blue-500"
                                />
                            </div>
                        </div>





                        <div className="flex flex-row items-center justify-between p-5 bg-white border-t border-gray-200 rounded-bl-lg rounded-br-lg">
                            <button
                                className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-1 px-4 border border-red-500 hover:border-transparent rounded"
                                onClick={onCloseModal}>
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={onClickSave}
                                className="min-w-[100px] py-2 px-2 text-sm font-semibold rounded text-white bg-blue-500 hover:bg-blue-600 focus:outline-none">
                                Save
                            </button>
                        </div>
                    </div>
                </div>


            </Modal>
        </>
    )
}

export default Salery