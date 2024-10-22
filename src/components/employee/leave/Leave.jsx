import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { ApiCaller } from '../../utils/ApiCaller';
import { useNavigate } from 'react-router-dom';

const Leave = () => {
  const navigate = useNavigate()
  const id = sessionStorage.getItem('id')
  const name = sessionStorage.getItem('name')
  const accessToken = sessionStorage.getItem('accessToken')

  const initialState = {
    leaveType: '',
    fromDate: '',
    toDate: '',
    leaveDays: '',
  }

  
  const [data, setData] = useState(initialState)

  const [leaveStatus, setLeaveStatus] = useState({
    status: '',
    fromDate: '',
    toDate: '',
    leaveDays: '',
    leaveType: '',
  })


  const handleChange = (e) => {
    console.log(e.target.value)
    const { name, value } = e.target;
    setData({ ...data, [name]: value })
  }

  useEffect(() => {
    if (!name || !id || !accessToken) {
      navigate('/')
      toast.error('Please Login First')
    }
  }, [])


  const onClickSubmit = async () => {
    if (!data.leaveType || !data.fromDate || !data.toDate) {
      toast.error('Fill all Feilds !')
      return
    }
    if (!name || !id) {
      toast.error('Please Login First')
      return
    }
    const toDate = new Date(data.toDate);
    const fromDate = new Date(data.fromDate);
    let timeDiff = toDate - fromDate
    let diffDays = timeDiff / (1000 * 3600 * 24)
    if (diffDays < 0) {
      toast.error('Invalied Date !')
      return
    }
    else {
      let noOfDays = diffDays + 1
      let headers = {
        "Content-Type": "application/json",
        "accessToken": accessToken,
        "userAgent": "altaNeo"
      }

      let body = JSON.stringify({
        applicantName: name,
        applicantId: id,
        fromDate: data.fromDate,
        toDate: data.toDate,
        leaveType: data.leaveType,
        leaveDays: noOfDays,
      })
      let response = await ApiCaller(body, headers, '/leave/reqForLeave')
      if (response.statusCode == '000') {
        toast.success(response.message)
        fetchApplicationStatus()
        setData(initialState)
      }
      else (
        toast.error(response.message)
      )
    }
  }


  const fetchApplicationStatus = async () => {
    let headers = {
      "Content-Type": "application/json",
      "accessToken": accessToken,
      "userAgent": "altaNeo"
    }
    let body = JSON.stringify({
      applicantId: id,
    })
    let response = await ApiCaller(body, headers, '/leave/leaveStatus')
    if (response.statusCode == '000') {
      setLeaveStatus({
        ...leaveStatus,
        status: response.data.applicationStatus,
        fromDate: response.data.fromDate,
        toDate: response.data.toDate,
        leaveType: response.data.leaveType,
        leaveDays: response.data.leaveDays,
      })
    }
  }

  useEffect(() => {
    fetchApplicationStatus()
  }, [])


  return (
    <div className="container mx-auto p-3">
      <div className="p-4 mb-5 rounded-xl bg-white">
        <div className='my-3'>
          <h3 className='block text-gray-700 text-sm font-bold '>Apply For Leave</h3>
        </div>
        <hr />
        <form >
          <div className="grid sm:grid-cols-3 gap-y-7 gap-x-12">
            <div>
              <label className="text-sm mb-2 block mt-4 font-medium text-gray-600">From Date</label>
              <input
                name="fromDate"
                type="date"
                className="bg-white w-full border-2 border-gray-400	 text-muted px-4 py-2 rounded-md outline-blue-500"
                placeholder="Enter name"
                value={data.fromDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm mb-2 block mt-4 font-medium text-gray-600">To Date</label>
              <input
                name="toDate"
                type="date"
                className="bg-white w-full border-2 border-gray-400	 text-muted px-4 py-2 rounded-md outline-blue-500"
                placeholder="Enter name"
                value={data.toDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm mb-2 block mt-4 font-semibold">Leave Type</label>
              <select
                name="leaveType"
                type="text"
                className="bg-white w-full border-2 border-gray-400	 text-muted px-4 py-2 rounded-md outline-blue-500"
                value={data.leaveType}
                onChange={handleChange}>
                <option value="" className='text-muted'>Select Type</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Paid Leave">Paid Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Extra Ordinary Leave">Extra Ordinary Leave</option>
              </select>
              <div className="mt-10 text-end">
                <button
                  type="button"
                  onClick={onClickSubmit}
                  className="min-w-[100px] py-2 px-2 text-sm font-semibold rounded text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                >Apply
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>


      {leaveStatus.status != '' && (
        <div className='mt-5 rounded-xl bg-white pb-2'>
          <h3 className='block text-gray-700 text-sm font-bold p-3'>Last Application</h3>
         <hr />
        <div class="relative h-auto mt-3 mb-1 ml-5 mr-4 flex flex-grow flex-row items-center rounded-[10px] border-[2px] border-blue-400 bg-blue-100 bg-clip-border dark:border-[#ffffff33] dark:bg-navy-800 dark:text-white dark:shadow-none">
          <div class="ml-[12px] w-full flex flex-col overflow-auto">
            <table class="w-full ">
              <thead>
                <tr>
                  <th class="px-5 py-3 text-left leading-4 text-black-500 tracking-wider">From Date</th>
                  <th class="px-5 py-3 text-left text-sm leading-4 text-black-500 tracking-wider">To date</th>
                  <th class="px-5 py-3 text-left text-sm leading-4 text-black-500 tracking-wider">Leave type</th>
                  <th class="px-5 py-3 text-left text-sm leading-4 text-black-500 tracking-wider">Leave days</th>
                  <th class="px-5 py-3 text-left text-sm leading-4 text-black-500 tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="px-4 py-2">
                    <div class="flex items-center">
                      <div>
                        <div class="text-sm font-semibold leading-5 text-black">{leaveStatus.fromDate}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-2 whitespace-no-wrap">
                    <div class="text-sm leading-5 font-semibold text-black">{leaveStatus.toDate}</div>
                  </td>
                  <td class="px-4 py-2 whitespace-no-wrap font-semibold text-black text-sm leading-5">{leaveStatus.leaveType}</td>
                  <td class="px-4 py-2 whitespace-no-wrap font-semibold text-black text-sm leading-5">{leaveStatus.leaveDays}</td>
                  <td class="px-4 py-2 whitespace-no-wrap font-semibold text-black text-sm leading-5">
                    {leaveStatus.status == 'Success' ? (
                      <div class="inline-flex items-center px-2 rounded-full gap-x-2 text-emerald-500 bg-emerald-100/60 dark:bg-gray-800">
                        <h2 class="text-sm font-medium">Success</h2>
                      </div>
                    ) : (
                      <div class="inline-flex items-center px-2 text-blue-500 rounded-full gap-x-2 bg-blue-100/60 dark:bg-gray-800">
                        <h2 class="text-sm font-medium">Pending</h2>
                      </div>
                    )
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        </div>
      )}
    </div>
  )
}

export default Leave