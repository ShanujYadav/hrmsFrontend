import React, { useContext, useEffect, useState } from 'react'
import { ApiCaller } from '../../utils/ApiCaller';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AdminContext } from '../AdminContext';
import { RxCrossCircled } from "react-icons/rx";

const Notification = (props) => {
  const [data, setData, profileDetails] = useContext(AdminContext)

  const navigate = useNavigate()
  const email = sessionStorage.getItem('email')
  const user = sessionStorage.getItem('user')

  const [request, setRequest] = useState([])
  const [reqId, setReqId] = useState()
  const [leaveReq, setLeaveReq] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [openRegModal, setOpenRegModal] = useState(false)
  let isMounted = true

  let initialState = {
    id: "",
    fromDate: "",
    toDate: "",
    leaveType: "",
    leaveDays: "",
  }

  
  const [onApprove, setOnApprove] = useState(initialState)

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

  useEffect(() => {
    if (!email || !user) {
      navigate('/')
      toast.error('Please Login First')
    }
  }, [])

  useEffect(() => {
    RegisterNotification()
    LeaveNotification()
    return () => {
      isMounted = false;
    }
  }, [])



  const RegisterNotification = async () => {
    let headers = {}
    let body = {}
    try {
      let response = await ApiCaller(body, headers, '/emp/reqRegisterList');
      if (isMounted && response.statusCode === '000') {
        setRequest(response.data)
      } else {
        setRequest([])
      }
    } catch (e) {
      if (isMounted) {
        setRequest([])
      }
      console.log(e);
    }
  }


  const onClickRegAction = (id) => {
    setReqId(id)
    setOpenRegModal(true)
  }

  const onVerifyEmp = async () => {
    if (!reqId) {
      toast.error('Something Went Wrong !')
    }
    try {
      let headers = {
        "Content-Type": "Application/Json",
        "User-Agent": "AltaNeo",
      }
      let body = JSON.stringify({
        id: reqId
      })
      const response = await ApiCaller(body, headers, '/emp/approvedReq')
      setOpenRegModal(false)
      if (response.statusCode == '000') {
        RegisterNotification()
        setReqId('')
        toast.success('Employee Registered !')
      }
      else {
        toast.error(response.message)
      }
    } catch (error) {
    }
  }





  // Leave  Section
  const LeaveNotification = async () => {
    let headers = {}
    let body = {}
    try {
      let response = await ApiCaller(body, headers, '/leave/reqleaveList')
      // console.log('leaveList response----', response)
      if (response.statusCode === '000') {
        setLeaveReq(response.data)
      } else {
        setLeaveReq([])
      }
    } catch (e) {
      if (isMounted) {
      }
      console.log(e);
    }
  }


  const onClickLeaveAction = (leaveReq) => {
    setOnApprove({
      ...onApprove,
      id: leaveReq.applicantId,
      fromDate: leaveReq.fromDate,
      toDate: leaveReq.toDate,
      leaveType: leaveReq.leaveType,
      leaveDays: leaveReq.leaveDays,
    })
    setOpenModal(true)
  }




  const onApproveLeave = async () => {
    let headers = {
      "Content-Type": "application/json",
    }

    let body = JSON.stringify({
      applicantId: onApprove.id,
      fromDate: onApprove.fromDate,
      toDate: onApprove.toDate,
      leaveType: onApprove.leaveType,
      leaveDays: onApprove.leaveDays,
    })
    try {
      setOpenModal(false)
      let response = await ApiCaller(body, headers, '/leave/approvedLeave')
      if (response.statusCode === '000') {
        toast.success(response.message)
        setOnApprove(initialState)
        LeaveNotification()
      } else {
        toast.error(response.message)
      }
    } catch (e) {
      if (isMounted) {
      }
      console.log(e)
    }
  }


  return (
    <>
      <div className="text-xl text-gray-800 font-bold mb-2 ml-4">Pending Requests</div>
      {!request || request.length == '0' ? (
        <>
        </>
      ) : request.map((req, index) => {
        return (
          <div ikey={index} class="relative h-auto mb-2 ml-5  flex flex-grow flex-row items-stretch rounded-[10px] border-[2px] border-yellow-400 bg-yellow-100 bg-clip-border dark:border-[#ffffff33] dark:bg-navy-800 dark:text-white dark:shadow-none">
            <div class="ml-[12px] w-full flex flex-col overflow-hidden">
              <div class="flex justify-between items-center">
                <p class="text-base font-semibold mt-2">Employee Register Request</p>
                <button
                  className="text-black font-semibold py-2 px-4 rounded-full transition-colors duration-200 ease-in-out flex items-center justify-center ml-auto mt-2"

                >
                  <RxCrossCircled size={24} />
                </button>

              </div>
              <hr class="border-0 bg-black h-px my-2" />
              <table class="w-full ">
                <thead>
                  <tr>
                    <th class="px-5 py-3 text-center text-sm leading-4 text-black-500 tracking-wider">Name</th>
                    <th class="px-5 py-3 text-center text-sm leading-4 text-black-500 tracking-wider">Email</th>
                    <th class="px-5 py-3 text-center text-sm leading-4 text-black-500 tracking-wider">Phone</th>
                    <th class="px-5 py-3 text-center text-sm leading-4 text-black-500 tracking-wider">Role</th>
                    <th class="px-5 py-3 text-center text-sm leading-4 text-black-500 tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="px-4 py-2 whitespace-no-wrap font-semibold text-black text-center text-sm leading-5">{req.name}</td>
                    <td class="px-4 py-2 whitespace-no-wrap font-semibold text-black text-center text-sm leading-5">{req.email}</td>
                    <td class="px-4 py-2 whitespace-no-wrap font-semibold text-black text-center text-sm leading-5">{req.phone}</td>
                    <td class="px-4 py-2 whitespace-no-wrap font-semibold text-black text-center text-sm leading-5">{req.role}</td>
                    <td class="px-4 py-2 whitespace-no-wrap text-blue-900 text-sm leading-5 text-center">
                      <button
                        onClick={() => onClickRegAction(req._id)}
                        class="bg-white hover:bg-black text-black font-semibold hover:text-white py-2 px-4 border border-yellow-500 hover:border-transparent rounded-full">
                        Accept
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
      })}




      {/* ----------------Leave Section------------------ */}
      {!leaveReq || leaveReq.length == '0' ? (
        <>
        </>
      ) : leaveReq.map((req, index) => {
        return (
          <div key={index} class="relative h-auto mb-1 ml-5 mr-4 mt-3 flex flex-grow flex-row items-center rounded-[10px] border-[2px] border-blue-400 bg-blue-100 bg-clip-border dark:border-[#ffffff33] dark:bg-navy-800 dark:text-white dark:shadow-none">
            <div class="ml-[12px] w-full flex flex-col overflow-auto">
              <p class="text-base font-semibold my-2">Leave Request</p>
              <hr class="mt-1 border-0 bg-black h-px" />
              <table class="w-full ">
                <thead>
                  <tr>
                    <th class="px-5 py-3 text-center text-sm leading-4 text-black-500 tracking-wider">Name</th>
                    <th class="px-5 py-3 text-center text-sm leading-4 text-black-500 tracking-wider">From Date</th>
                    <th class="px-5 py-3 text-center text-sm leading-4 text-black-500 tracking-wider">To Date</th>
                    <th class="px-5 py-3 text-center text-sm leading-4 text-black-500 tracking-wider">Leave Type</th>
                    <th class="px-5 py-3 text-center text-sm leading-4 text-black-500 tracking-wider">Days</th>
                    <th class="px-5 py-3 text-center text-sm leading-4 text-black-500 tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="px-4 py-2 whitespace-no-wrap font-semibold text-black text-center text-sm leading-5">{req.applicantName}</td>
                    <td class="px-4 py-2 whitespace-no-wrap font-semibold text-black text-center text-sm leading-5">{req.fromDate}</td>
                    <td class="px-4 py-2 whitespace-no-wrap font-semibold text-black text-center text-sm leading-5">{req.toDate}</td>
                    <td class="px-4 py-2 whitespace-no-wrap font-semibold text-black text-center text-sm leading-5">{req.leaveType}</td>
                    <td class="px-4 py-2 whitespace-no-wrap font-semibold text-black text-center text-sm leading-5">{req.leaveDays}</td>
                    <td class="px-4 py-2 whitespace-no-wrap text-blue-900 text-sm leading-5 text-center">
                      <button
                        onClick={() => onClickLeaveAction(req)}
                        class="bg-white hover:bg-black text-black font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-full">
                        Approve
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
      })}





      <div>
        <Modal
          isOpen={openRegModal}
          onRequestClose={setOpenRegModal}
          style={customStyles}
          contentLabel="Example Modal">
          <div class="border p-8 rounded-lg text-center">
            <div class="text-yellow-500 text-6xl mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h2 class="text-xl font-semibold mb-2">Accept the user?</h2>
            <p class="text-gray-600">You will accept the user if you click on Yes</p>
            <div class="mt-8 flex justify-center space-x-4">
              <button
                onClick={() => setOpenRegModal(false)}
                class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">No
              </button>
              <button
                onClick={onVerifyEmp}
                class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">Yes
              </button>

            </div>
          </div>
        </Modal>




        {/*------------ Leave Modal---------------- */}
        <Modal
          isOpen={openModal}
          onRequestClose={setOpenModal}
          style={customStyles}
          contentLabel="Example Modal">
          <div class="p-8 rounded-lg text-center max-w-md mx-auto">
            <div class="text-blue-400 text-6xl mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h2 class="text-xl font-semibold mb-2">Approve Leave Request?</h2>
            <p class="text-gray-600">You will approve the leave request by clicking on Yes</p>

            <div class="mt-8 flex justify-center space-x-4">
              <button
                onClick={() => setOpenModal(false)}
                class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">No</button>
              <button
                onClick={onApproveLeave}
                class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">Yes</button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  )
}

export default Notification

// <div class="text-center p-6 bg-white rounded-lg ">
// <div class="flex items-center justify-center mb-4">
//   <svg class="w-24 h-24 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2l4-4m5 4a9 9 0 1 1-18 0a9 9 0 0 1 18 0z"></path>
//   </svg>
// </div>
// <div>
//   <h1 class="text-xl font-bold text-gray-800 mb-4">Are you sure you want to Approve !</h1>
// </div>
// <button class="bg-white mx-2 text-red-500 border-2 border-gray-600 px-4 py-0.5 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//   onClick={() => setOpenModal(false)}
// >
//   Cancle
// </button>
// <button class="bg-blue-500 text-white px-4 py-0.5 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//   onClick={onApproveLeave}
// >
//   OK
// </button>
// </div>