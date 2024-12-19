import React, { useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { FaArrowDown } from "react-icons/fa6";
import { IoIosPrint } from "react-icons/io";
import logo from '../../../assets/img/ANlogo.png';
import { ApiCaller } from '../../utils/ApiCaller';
import { toast } from 'react-toastify';



const SalerySlip = () => {
    const printRef = React.useRef()
    const [selectedYear, setSelectedYear] = useState()
    const [selectedMonth, setSelectedMonth] = useState()
    const [showSlip, setShowSlip] = useState(false)
    const employeeId = sessionStorage.getItem("id")
    const empName = sessionStorage.getItem("name")
    const role = sessionStorage.getItem("role")
    const pan = sessionStorage.getItem("pan")
    const pf = sessionStorage.getItem("pf")
    const doj = sessionStorage.getItem("joiningDate")


    const [data, setData] = useState({
        year: "",
        month: "",
        workingDays: "",
        leaveDays: "",
        absenceDays: "",
        baseSalary: "",
        hra: "",
        allowance: "",
        otherEarnings: "",
        incomeTax: "",
        pf: "",
        otherDeductions: "",
    })

    const lo = (data.baseSalary / 30) * data.absenceDays
    const lop = lo.toFixed(2)
    const grossEarn = Number(data.baseSalary + data.hra + data.allowance + data.otherEarnings)
    const grossEarnings = grossEarn.toFixed(2)
    const totalDed = Number(data.incomeTax + data.pf + ((data.baseSalary / 30) * data.absenceDays) + data.otherDeductions)
    const totalDeductions = totalDed.toFixed(2)

    const netSal = grossEarnings - totalDeductions
    const netSalary = netSal.toFixed(2)


    const handleDownloadPdf = async () => {
        const element = printRef.current;
        const canvas = await html2canvas(element);
        const data = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgProperties = pdf.getImageProperties(data)
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
        pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("Salary Slip.pdf")
    }


    const handlePrint = async () => {
        const element = printRef.current;
        const canvas = await html2canvas(element);
        const data = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgProperties = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
        pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.autoPrint();
        window.open(pdf.output("bloburl"), "_blank");
    }


    const onSelectMonth = async (month) => {
        setSelectedMonth(month)
        if (!selectedYear || !month || !employeeId) {
            toast.error('Fill all Feilds !')
            return
        } else {
            let headers = {
                "Content-Type": "application/json",
                "userAgent": "altaNeo"
            }
            
            let body = JSON.stringify({
                employeeId: employeeId,
                year: selectedYear,
                month: month,
            })

            let response = await ApiCaller(body, headers, '/salary/getSalary')
            console.log("response---", response)
            if (response.statusCode == '000') {
                setData({
                    ...data,
                    year: response.data.year,
                    month: response.data.monthData.month,
                    workingDays: response.data.monthData.workingDays,
                    leaveDays: response.data.monthData.leaveDays,
                    absenceDays: response.data.monthData.absenceDays,
                    baseSalary: response.data.monthData.baseSalary,
                    hra: response.data.monthData.hra,
                    allowance: response.data.monthData.allowance,
                    otherEarnings: response.data.monthData.otherEarnings,
                    incomeTax: response.data.monthData.incomeTax,
                    pf: response.data.monthData.pf,
                    otherDeductions: response.data.monthData.otherDeductions,
                })
                setShowSlip(true)
                toast.success(response.message)
            }
            else {
                setShowSlip(false)
                toast.error(response.message)
            }
        }
    }

    return (
        <div className="container mx-auto p-3 items-center">
            <div className="p-2 mb-5 rounded-xl bg-white">
                <div className='my-1'>
                    <h3 className='block text-gray-700 text-md font-bold '>Salary Slip</h3>
                </div>
                <hr />
                <form >
                    <div className="grid sm:grid-cols-3 gap-y-7 gap-x-12">
                        <div>
                            <label className="text-sm mb-2 block mt-4 font-medium text-gray-600">Select Year</label>
                            <select
                                name="year"
                                type="text"
                                className="bg-white w-3/4 border-2 border-gray-400	 text-muted px-4 py-2 rounded-md outline-blue-500"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                <option value="" className='text-muted'>Select Year</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm mb-2 block mt-4 font-medium text-gray-600">Select Month</label>
                            <select
                                name="leaveType"
                                type="text"
                                className="bg-white w-3/4 border-2 border-gray-400	 text-muted px-4 py-2 rounded-md outline-blue-500"
                                value={selectedMonth}
                                onChange={(e) => onSelectMonth(e.target.value)}>

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
                    </div>
                </form>
            </div>

            {showSlip &&
                <div className="p-2 mb-2 rounded-xl bg-white">
                    <div className="my-1 flex justify-between items-center">
                        <h3 className="text-gray-700 text-md font-bold"></h3>
                        <div className="flex space-x-2">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
                                onClick={handleDownloadPdf}
                            >
                                <FaArrowDown />
                            </button>

                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
                                onClick={handlePrint}
                            >
                                <IoIosPrint />
                            </button>
                        </div>

                    </div>
                    <hr />


                    <div className="w-full ">
                        <div className="p-4" ref={printRef}>
                            <div className="max-w-screen-md mx-auto p-4 bg-white">
                                <div className="flex justify-between items-center border-b pb-4">
                                    <div>
                                        <img src={logo} alt="Altaneo Logo" className="h-20 w-30" />
                                        <p className="text-sm text-muted"></p>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold">Altaneo Finance Pvt. Ltd.</h2>
                                        <p className="text-sm text-gray-500 text-muted">934, Block-3, Spaze i-tech Park<br />Sector 49, Gurugram (India)</p>
                                    </div>
                                </div>
                                <div className='text-center my-2'>
                                    <h2 className="text-lg font-bold">Salary Details for {data.month}-{data.year}</h2>
                                </div>


                                <div className="mt-8 mb-4 grid grid-cols-2 gap-3">
                                    <div className="flex justify-between">
                                        <p className="text-sm font-medium">Name:</p>
                                        <p className="text-sm">{empName}</p>
                                    </div>

                                    <div className="flex justify-between">
                                        <p className="text-sm font-medium">Emp PAN:</p>
                                        <p className="text-sm">{pan}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm font-medium">Designation:</p>
                                        <p className="text-sm">{role}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm font-medium">DOJ:</p>
                                        <p className="text-sm">{doj}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm font-medium">PF NO:</p>
                                        <p className="text-sm">{pf}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm font-medium">Working Days:</p>
                                        <p className="text-sm">{data.workingDays}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm font-medium">Leave:</p>
                                        <p className="text-sm">{data.leaveDays}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm font-medium">Absence:</p>
                                        <p className="text-sm">{data.absenceDays}</p>
                                    </div>
                                </div>

                                <table className="min-w-full table-auto mt-6">
                                    <thead className="bg-gray-200 w-full">
                                        <tr>
                                            <th className="text-left p-2 text-sm font-medium text-black">EARNINGS</th>
                                            <th className="text-end p-2 text-sm font-medium text-black border-r border-black">Amount</th>
                                            <th className="p-2 text-left text-sm font-medium text-Black">DEDUCTIONS</th>
                                            <th className="p-2 text-end text-sm font-medium text-black">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b">
                                            <td className="p-2 text-sm text-gray-800">Basic</td>
                                            <td className="p-2 text-sm text-end text-gray-800 border-r border-black">{data.baseSalary}</td>
                                            <td className="p-2 text-sm text-left text-gray-800">Income Tax</td>
                                            <td className="p-2 text-sm text-right text-gray-800">{data.incomeTax}</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="p-2 text-sm text-gray-800">Allowances</td>
                                            <td className="p-2 text-sm text-end text-gray-800 border-r border-black">{data.allowance}</td>
                                            <td className="p-2 text-sm text-left text-gray-800">PF</td>
                                            <td className="p-2 text-sm text-right text-gray-800">{data.pf}</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="p-2 text-sm text-gray-800">HRA</td>
                                            <td className="p-2 text-sm text-end text-gray-800 border-r border-black">{data.hra}</td>
                                            <td className="p-2 text-sm text-left text-gray-800">LOP</td>
                                            <td className="p-2 text-sm text-right text-gray-800">{lop}</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="p-2 text-sm text-gray-800">Others</td>
                                            <td className="p-2 text-sm text-end text-gray-800 border-r border-black">{data.otherEarnings}</td>
                                            <td className="p-2 text-sm text-gray-800">Others</td>
                                            <td className="p-2 text-sm text-end text-gray-800">{data.otherDeductions}</td>
                                        </tr>
                                        <tr className="border-t-2 border-b-2 border-black">
                                            <td className="p-2 text-sm text-gray-800">Gross Earnings</td>
                                            <td className="p-2 text-sm text-end text-black border-r border-black">{grossEarnings}</td>
                                            <td className="p-2 text-sm text-gray-800">Total Deductions</td>
                                            <td className="p-2 text-sm text-end text-gray-800">{totalDeductions}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="mt-6">
                                    <div className="flex justify-between  pt-4">
                                        <h3 className="text-md font-semibold">Net Salary</h3>
                                        <p className="text-md font-bold">₹ {netSalary}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div >
    )
}
export default SalerySlip;