import React, { useEffect, useState } from 'react';
import { ApiCaller } from '../../utils/ApiCaller';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { RxCross2 } from "react-icons/rx";

const EmployeeList = () => {
    const navigate = useNavigate();
    const [employee, setEmployee] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false)

    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [empToDelete, setEmpToDelete] = useState(null)

    const initialState = {
        id: '',
        img: '',
        name: '',
        phone: '',
        email: '',
        gender: '',
        dateOfBirth: '',
        education: '',
        role: '',
        joiningDate: '',
        address: ''
    };
    const [data, setData] = useState(initialState);

    const onCloseModal = () => {
        console.log('jdbnn');

        setOpenModal(false);
        setData(initialState);
        setIsEditing(false);
    };

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const onClickViewProfile = (emp) => {
        const { _id, img, name, phone, email, gender, dateOfBirth, education, role, joiningDate, address } = emp;
        setOpenModal(true);
        setData({
            id: _id,
            img,
            name,
            phone,
            email,
            gender,
            dateOfBirth,
            education,
            role,
            joiningDate,
            address
        });
    }

    const onSaveHandler = async () => {
        const { id, img, name, phone, email, gender, dateOfBirth, education, role, joiningDate, address } = data;

        if (!id || !img || !name || !phone || !email || !gender || !dateOfBirth || !education || !role || !joiningDate || !address) {
            toast.error('Please fill in all fields!');
            return;
        }

        try {
            let formData = new FormData();
            formData.append('id', id);
            formData.append('img', img);
            formData.append('name', name);
            formData.append('phone', phone);
            formData.append('email', email);
            formData.append('gender', gender);
            formData.append('dateOfBirth', dateOfBirth);
            formData.append('education', education);
            formData.append('role', role);
            formData.append('joiningDate', joiningDate);
            formData.append('address', address);

            let headers = {
                "userAgent": "altaNeo"
            };

            let response = await ApiCaller(formData, headers, '/emp/updateEmpInfo', 'POST');
            if (response.statusCode === '000') {
                toast.success(response.message);
                setOpenModal(false);
                setIsEditing(false);
                setData(initialState);
                fetchData();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error updating employee:', error);
            toast.error('An error occurred. Please try again.');
        }
    }

    const handleUploadClick = (e) => {
        e.preventDefault();
        document.getElementById('fileInput').click();
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setData({ ...data, img: reader.result });
            };
            reader.readAsDataURL(file);
        }
    }

    const onClickDelete = (empId) => {
        setOpenDeleteModal(true)
        setEmpToDelete(empId)
    }

    const confirmDeleteProfile = async () => {
        let headers = {
            "Content-Type": "application/json",
            "userAgent": "altaNeo"
        }
        let body = JSON.stringify({
            id: empToDelete
        })
        try {
            let response = await ApiCaller(body, headers, '/emp/deleteEmp')
            console.log('response---', response)
            if (response.statusCode === '000') {
                toast.success(response.message)
                setOpenDeleteModal(false)
                fetchData()
            }
            else {
                toast.error(response.message)
            }
        } catch (e) {
            console.log('error---', e)
        }
    }

    const onCloseDeleteModal = () => {
        setOpenDeleteModal(false)
        setEmpToDelete(null)
    }

    const fetchData = async () => {
        setEmployee([])
        let headers = {}
        let body = {}
        try {
            let response = await ApiCaller(body, headers, '/emp/empList')
            if (response.statusCode === '000') {
                setEmployee(response.data);
            } else {
                setEmployee([])
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <div className="justify-center items-start h-auto dark:bg-gray-700 bg-gray-200 py-12 px-5">
                {employee.length === 0 ? (
                    <h2>No employees found.</h2>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {employee.map((emp) => (
                            <div key={emp._id} className="max-w-sm bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                                <div className="border-b px-4 pb-6">
                                    <div className="text-center my-4">
                                        <img
                                            className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 mx-auto my-4"
                                            src={emp.img}
                                            alt={emp.name}
                                        />
                                        <div className="py-1">
                                            <h3 className="font-bold text-2xl text-gray-800 dark:text-white mb-1">{emp.name}</h3>
                                            <div className="inline-flex text-gray-700 dark:text-gray-300 items-center">
                                                {emp.role}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 px-2">
                                        <button
                                            className="flex-1 rounded-full bg-transparent hover:bg-red-500 hover:text-white font-semibold py-2 px-4 border border-red-500 text-red-500 hover:border-transparent"
                                            onClick={() => onClickDelete(emp._id)}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className="flex-1 rounded-full bg-blue-600 dark:bg-blue-800 text-white antialiased font-bold hover:bg-blue-800 dark:hover:bg-blue-900 px-3 py-1.5 text-sm"
                                            onClick={() => onClickViewProfile(emp)}
                                        >
                                            View
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={openDeleteModal}
                onRequestClose={onCloseDeleteModal}
                contentLabel="Delete Confirmation Modal"
                className="overflow-hidden"
            >
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-semibold text-gray-800">Confirm Delete</h2>
                        <p className="mt-4 text-gray-600">Are you sure you want to delete this profile?</p>
                        <div className="mt-6 flex justify-end space-x-3">

                            <button
                                className="rounded-full bg-gray-500 text-white px-4 py-2 hover:bg-gray-400"
                                onClick={onCloseDeleteModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="rounded-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400"
                                onClick={confirmDeleteProfile}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={openModal}
                onRequestClose={onCloseModal}
                contentLabel="Example Modal"
                className='overflow:hidden'
            >
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl h-[90vh] flex flex-col">
                        <div className="relative flex justify-between items-center p-4">
                            <div></div>
                            <span className="font-bold text-center text-2xl block">Profile Information</span>
                            <RxCross2 className="cursor-pointer" onClick={onCloseModal} />
                        </div>
                        <div className="flex-1 overflow-auto p-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-md min-h-[300px]">
                                    <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div>
                                    <div className="max-w-2xl">
                                        <div className="grid grid-cols-2 gap-x-10 gap-y-10 mx-4 sm:grid-cols-2">
                                            <div className="relative inline-block">
                                                <img
                                                    src={data.img || 'default-image-url'}
                                                    alt="Avatar"
                                                    className="rounded-full h-20 w-20"
                                                />

                                                <button
                                                    className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 h-8 w-8 bg-blue-600 text-white rounded-full border-2 border-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out flex items-center justify-center"
                                                    onClick={handleUploadClick}
                                                >
                                                    <svg
                                                        className="h-5 w-5 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M12 4v16m8-8H4"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                            <input
                                                type="file"
                                                id="fileInput"
                                                style={{ display: 'none' }}
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                            <div className="py-3">
                                                <label htmlFor="name" className="block font-semibold text-sm leading-6 text-black">Name</label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={data.name}
                                                        onChange={onChangeHandler}
                                                        className="border rounded-md p-2 w-full"
                                                    />
                                                ) : (
                                                    <h6 className="text-gray-600 text-sm">{data.name}</h6>
                                                )}
                                            </div>
                                            <div className="py-3">
                                                <label htmlFor="phone" className="block font-semibold text-sm leading-6 text-black">Phone</label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        name="phone"
                                                        value={data.phone}
                                                        onChange={onChangeHandler}
                                                        className="border rounded-md p-2 w-full"
                                                    />
                                                ) : (
                                                    <h6 className="text-gray-600 text-sm">{data.phone}</h6>
                                                )}
                                            </div>
                                            <div className="py-3">
                                                <label htmlFor="email" className="block font-semibold text-sm leading-6 text-black">Email</label>
                                                {isEditing ? (
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={data.email}
                                                        onChange={onChangeHandler}
                                                        className="border rounded-md p-2 w-full"
                                                    />
                                                ) : (
                                                    <h6 className="text-gray-600 text-sm">{data.email}</h6>
                                                )}
                                            </div>
                                            <div className="">
                                                <label htmlFor="gender" className="block font-semibold text-sm leading-6 text-black">Gender</label>
                                                {isEditing ? (
                                                    <select
                                                        name="gender"
                                                        value={data.gender}
                                                        onChange={onChangeHandler}
                                                        className="border rounded-md p-2 w-full"
                                                    >
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                ) : (
                                                    <h6 className="text-gray-600 text-sm">{data.gender}</h6>
                                                )}
                                            </div>
                                            <div className="">
                                                <label htmlFor="DOB" className="block font-semibold text-sm leading-6 text-black">DOB</label>
                                                {isEditing ? (
                                                    <input
                                                        type="date"
                                                        name="dateOfBirth"
                                                        value={data.dateOfBirth}
                                                        onChange={onChangeHandler}
                                                        className="border rounded-md p-2 w-full"
                                                    />
                                                ) : (
                                                    <h6 className="text-gray-600 text-sm">{data.dateOfBirth}</h6>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="bg-white p-4 rounded-md min-h-[300px]">
                                    <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div>
                                    <div className="max-w-2xl">
                                        <div className="grid grid-cols-2 gap-x-10 gap-y-10 mx-4 sm:grid-cols-2">
                                            <div className="py-3">
                                                <label htmlFor="education" className="block font-semibold text-sm leading-6 text-black">Education</label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        name="education"
                                                        value={data.education}
                                                        onChange={onChangeHandler}
                                                        className="border rounded-md p-2 w-full"
                                                    />
                                                ) : (
                                                    <h6 className="text-gray-600 text-sm">{data.education}</h6>
                                                )}
                                            </div>
                                            <div className="py-3">
                                                <label htmlFor="designation" className="block font-semibold text-sm leading-6 text-black">Designation</label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        name="role"
                                                        value={data.role}
                                                        onChange={onChangeHandler}
                                                        className="border rounded-md p-2 w-full"
                                                    />
                                                ) : (
                                                    <h6 className="text-gray-600 text-sm">{data.role}</h6>
                                                )}
                                            </div>
                                            <div className="py-3">
                                                <label htmlFor="department" className="block font-semibold text-sm leading-6 text-black">Address</label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        name="address"
                                                        value={data.address}
                                                        onChange={onChangeHandler}
                                                        className="border rounded-md p-2 w-full"
                                                    />
                                                ) : (
                                                    <h6 className="text-gray-600 text-sm">{data.address}</h6>
                                                )}
                                            </div>
                                            <div className="py-3">
                                                <label htmlFor="DOJ" className="block font-semibold text-sm leading-6 text-black">DOJ</label>
                                                {isEditing ? (
                                                    <input
                                                        type="date"
                                                        name="joiningDate"
                                                        value={data.joiningDate}
                                                        onChange={onChangeHandler}
                                                        className="border rounded-md p-2 w-full"
                                                    />
                                                ) : (
                                                    <h6 className="text-gray-600 text-sm">{data.joiningDate}</h6>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between space-x-1 mt-6 p-2 border-t border-blue-500">
                            <button
                                onClick={onCloseModal}
                                className="bg-transparent hover:bg-red-500 mt-2 text-red-700 font-semibold hover:text-white py-1 px-4 border border-red-500 hover:border-transparent rounded"
                            >
                                Cancel
                            </button>
                            <div>
                                {isEditing ? (
                                    <button
                                        onClick={onSaveHandler}
                                        className="px-4 py-2 bg-green-500 mt-2 text-white text-sm font-medium rounded-md hover:bg-green-600"
                                    >Save
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-blue-500 mt-2 text-white text-sm font-medium rounded-md hover:bg-blue-600"
                                    >Edit
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default EmployeeList;


// import React, { useEffect, useState } from 'react';
// import { ApiCaller } from '../../utils/ApiCaller';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import Modal from 'react-modal';
// import { RxCross2 } from "react-icons/rx";

// const EmployeeList = () => {
//     const navigate = useNavigate();
//     const [employee, setEmployee] = useState([]);
//     const [openModal, setOpenModal] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const initialState = {
//         id: '',
//         img: '',
//         name: '',
//         phone: '',
//         email: '',
//         gender: '',
//         dateOfBirth: '',
//         education: '',
//         role: '',
//         joiningDate: '',
//         address: ''
//     };
//     const [data, setData] = useState(initialState);

//     const onCloseModal = () => {
//         setOpenModal(false);
//         setData(initialState);
//         setIsEditing(false);
//     };

//     const onChangeHandler = (e) => {
//         const { name, value } = e.target;
//         setData({ ...data, [name]: value });
//     };

//     const onClickViewProfile = (emp) => {
//         const { _id, img, name, phone, email, gender, dateOfBirth, education, role, joiningDate, address } = emp;
//         setOpenModal(true);
//         setData({
//             id: _id,
//             img,
//             name,
//             phone,
//             email,
//             gender,
//             dateOfBirth,
//             education,
//             role,
//             joiningDate,
//             address
//         });
//     };

//     const onSaveHandler = async () => {
//         const { id, img, name, phone, email, gender, dateOfBirth, education, role, joiningDate, address } = data;
//         if (!id || !img || !name || !phone || !email || !gender || !dateOfBirth || !education || !role || !joiningDate || !address) {
//             toast.error('Please fill in all fields!');
//             return
//         }
//         try {
//             let formData = new FormData();
//             formData.append('id', id);
//             formData.append('img', img);
//             formData.append('name', name);
//             formData.append('phone', phone);
//             formData.append('email', email);
//             formData.append('gender', gender);
//             formData.append('dateOfBirth', dateOfBirth);
//             formData.append('education', education);
//             formData.append('role', role);
//             formData.append('joiningDate', joiningDate);
//             formData.append('address', address)

//             let headers = {
//                 "userAgent": "altaNeo"
//             };

//             let response = await ApiCaller(formData, headers, '/emp/updateEmpInfo', 'POST');
//             if (response.statusCode === '000') {
//                 toast.success(response.message);
//                 setOpenModal(false);
//                 setIsEditing(false);
//                 setData(initialState);
//                 fetchData();
//             } else {
//                 toast.error(response.message);
//             }
//         } catch (error) {
//             console.error('Error updating employee:', error);
//             toast.error('An error occurred. Please try again.');
//         }
//     };

//     const onEditHandler = () => setIsEditing(true);

//     const handleUploadClick = (e) => {
//         e.preventDefault();
//         document.getElementById('fileInput').click();
//     };

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setData({ ...data, img: reader.result });
//             };
//             reader.readAsDataURL(file);
//         }
//     }

//     const onDeleteProfile = async (emp) => {
//         if (window.confirm('Are you sure you want to delete this profile?')) {
//             try {
//                 let headers = {
//                     "userAgent": "altaNeo"
//                 }
//                 let response = await ApiCaller({ id: emp._id }, headers, '/emp/deleteEmp', 'DELETE');
//                 if (response.statusCode === '000') {
//                     toast.success(response.message);
//                     fetchData()
//                 } else {
//                     toast.error(response.message)
//                 }
//             } catch (error) {
//                 console.error('Error deleting employee:', error);
//                 toast.error('An error occurred while deleting the profile. Please try again.');
//             }
//         }
//     }


//     const fetchData = async () => {
//         setEmployee([]);
//         try {
//             let response = await ApiCaller({}, {}, '/emp/empList');
//             if (response.statusCode === '000') {
//                 setEmployee(response.data);
//             } else {
//                 setEmployee([]);
//             }
//         } catch (e) {
//             console.error('Error fetching employee list:', e);
//         }
//     }

//     useEffect(() => {
//         fetchData();
//     }, [])

//     return (
//         <>
//             <div className="justify-center items-start h-auto dark:bg-gray-700 bg-gray-200 py-12 px-5">
//                 {employee.length === 0 ? (
//                     <h2>No employees found.</h2>
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {employee.map((emp) => (
//                             <div key={emp._id} className="max-w-sm bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
//                                 <div className="border-b px-4 pb-6">
//                                     <div className="text-center my-4">
//                                         <img
//                                             className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 mx-auto my-4"
//                                             src={emp.img}
//                                             alt={emp.name}
//                                         />
//                                         <div className="py-1">
//                                             <h3 className="font-bold text-2xl text-gray-800 dark:text-white mb-1">{emp.name}</h3>
//                                             <div className="inline-flex text-gray-700 dark:text-gray-300 items-center">
//                                                 {emp.role}
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="flex gap-2 px-2">
//                                         <button
//                                             className="flex-1 rounded-full bg-transparent hover:bg-red-500 hover:text-white font-semibold hover:text-white py-2 px-4 border border-red-500 text-red-500 hover:border-transparent rounded"
//                                             onClick={() => onDeleteProfile(emp)}
//                                         >Delete
//                                         </button>
//                                         <button
//                                             className="flex-1 rounded-full bg-blue-600 dark:bg-blue-800 text-white antialiased font-bold hover:bg-blue-800 dark:hover:bg-blue-900 px-3 py-1.5 text-sm"
//                                             onClick={() => onClickViewProfile(emp)}
//                                         >
//                                             View
//                                         </button>
//                                     </div>

//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             <Modal
//                 isOpen={openModal}
//                 onRequestClose={onCloseModal}
//                 contentLabel="Employee Profile Modal"
//                 className="overflow-hidden"
//             >
//                 <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//                     <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl h-[90vh] flex flex-col">
//                         <div className="cursor-pointer">
//                             <span className="font-bold text-center text-2xl block">Profile Information</span>
//                             <RxCross2 className="absolute top-2 right-2 cursor-pointer" onClick={onCloseModal} />
//                         </div>
//                         <div className="flex-1 overflow-auto p-2">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//                                 <div className="bg-white p-4 rounded-md min-h-[300px]">
//                                     <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div>
//                                     <div className="max-w-2xl">
//                                         <div className="grid grid-cols-2 gap-x-10 gap-y-10 mx-4 sm:grid-cols-2">
//                                             <div className="relative inline-block">
//                                                 <img
//                                                     src={data.img || 'default-image-url'}
//                                                     alt="Avatar"
//                                                     className="rounded-full h-20 w-20"
//                                                 />
//                                                 <button
//                                                     className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 h-8 w-8 bg-blue-600 text-white rounded-full border-2 border-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out flex items-center justify-center"
//                                                     onClick={handleUploadClick}
//                                                 >
//                                                     <svg
//                                                         className="h-5 w-5 text-white"
//                                                         fill="none"
//                                                         stroke="currentColor"
//                                                         viewBox="0 0 24 24"
//                                                         xmlns="http://www.w3.org/2000/svg"
//                                                     >
//                                                         <path
//                                                             strokeLinecap="round"
//                                                             strokeLinejoin="round"
//                                                             strokeWidth="2"
//                                                             d="M12 4v16m8-8H4"
//                                                         />
//                                                     </svg>
//                                                 </button>
//                                             </div>
//                                             <input
//                                                 type="file"
//                                                 id="fileInput"
//                                                 className="hidden"
//                                                 onChange={handleFileChange}
//                                             />
//                                             <div className="flex flex-col">
//                                                 <label htmlFor="name" className="font-semibold">Name:</label>
//                                                 <input
//                                                     type="text"
//                                                     id="name"
//                                                     name="name"
//                                                     value={data.name}
//                                                     onChange={onChangeHandler}
//                                                     disabled={!isEditing}
//                                                     className="mt-1 p-2 border rounded-md"
//                                                 />
//                                                 <label htmlFor="phone" className="font-semibold mt-2">Phone:</label>
//                                                 <input
//                                                     type="text"
//                                                     id="phone"
//                                                     name="phone"
//                                                     value={data.phone}
//                                                     onChange={onChangeHandler}
//                                                     disabled={!isEditing}
//                                                     className="mt-1 p-2 border rounded-md"
//                                                 />
//                                                 <label htmlFor="email" className="font-semibold mt-2">Email:</label>
//                                                 <input
//                                                     type="email"
//                                                     id="email"
//                                                     name="email"
//                                                     value={data.email}
//                                                     onChange={onChangeHandler}
//                                                     disabled={!isEditing}
//                                                     className="mt-1 p-2 border rounded-md"
//                                                 />
//                                                 <label htmlFor="gender" className="font-semibold mt-2">Gender:</label>
//                                                 <input
//                                                     type="text"
//                                                     id="gender"
//                                                     name="gender"
//                                                     value={data.gender}
//                                                     onChange={onChangeHandler}
//                                                     disabled={!isEditing}
//                                                     className="mt-1 p-2 border rounded-md"
//                                                 />
//                                                 <label htmlFor="dateOfBirth" className="font-semibold mt-2">Date of Birth:</label>
//                                                 <input
//                                                     type="date"
//                                                     id="dateOfBirth"
//                                                     name="dateOfBirth"
//                                                     value={data.dateOfBirth}
//                                                     onChange={onChangeHandler}
//                                                     disabled={!isEditing}
//                                                     className="mt-1 p-2 border rounded-md"
//                                                 />
//                                             </div>
//                                             <div className="flex flex-col">
//                                                 <label htmlFor="education" className="font-semibold">Education:</label>
//                                                 <input
//                                                     type="text"
//                                                     id="education"
//                                                     name="education"
//                                                     value={data.education}
//                                                     onChange={onChangeHandler}
//                                                     disabled={!isEditing}
//                                                     className="mt-1 p-2 border rounded-md"
//                                                 />
//                                                 <label htmlFor="role" className="font-semibold mt-2">Role:</label>
//                                                 <input
//                                                     type="text"
//                                                     id="role"
//                                                     name="role"
//                                                     value={data.role}
//                                                     onChange={onChangeHandler}
//                                                     disabled={!isEditing}
//                                                     className="mt-1 p-2 border rounded-md"
//                                                 />
//                                                 <label htmlFor="joiningDate" className="font-semibold mt-2">Joining Date:</label>
//                                                 <input
//                                                     type="date"
//                                                     id="joiningDate"
//                                                     name="joiningDate"
//                                                     value={data.joiningDate}
//                                                     onChange={onChangeHandler}
//                                                     disabled={!isEditing}
//                                                     className="mt-1 p-2 border rounded-md"
//                                                 />
//                                                 <label htmlFor="address" className="font-semibold mt-2">Address:</label>
//                                                 <input
//                                                     type="text"
//                                                     id="address"
//                                                     name="address"
//                                                     value={data.address}
//                                                     onChange={onChangeHandler}
//                                                     disabled={!isEditing}
//                                                     className="mt-1 p-2 border rounded-md"
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="flex justify-end mt-4">
//                             {isEditing ? (
//                                 <button
//                                     className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
//                                     onClick={onSaveHandler}
//                                 >
//                                     Save
//                                 </button>
//                             ) : (
//                                 <button
//                                     className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
//                                     onClick={onEditHandler}
//                                 >
//                                     Edit
//                                 </button>
//                             )}
//                             <button
//                                 className="bg-gray-500 text-white px-4 py-2 rounded"
//                                 onClick={onCloseModal}
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </Modal>
//         </>
//     );
// }
// export default EmployeeList;






// // import React, { useEffect, useState } from 'react';
// // import { ApiCaller } from '../../utils/ApiCaller';
// // import { LuPencil } from "react-icons/lu";
// // import { MdOutlineEmail } from "react-icons/md";
// // import { MdDelete } from "react-icons/md";
// // import { useNavigate } from 'react-router-dom';
// // import { toast } from 'react-toastify';
// // import Modal from 'react-modal';
// // import { MdOutlineMailOutline } from "react-icons/md";
// // import { RxCross2 } from "react-icons/rx";


// // const EmployeeList = (props) => {
// //     const navigate = useNavigate()
// //     const email = sessionStorage.getItem('email')
// //     const user = sessionStorage.getItem('user')
// //     const [employee, setEmployee] = useState([])
// //     const [openModal, setOpenModal] = useState(false)
// //     const [isEditing, setIsEditing] = useState(false)

// //     const initialState = {
// //         id: '',
// //         img: '',
// //         name: '',
// //         phone: '',
// //         email: '',
// //         gender: '',
// //         dateOfBirth: '',
// //         education: '',
// //         role: '',
// //         joiningDate: '',
// //         address: ''
// //     }

// //     const [data, setData] = useState(initialState)

// //     const onCloseModal = () => {
// //         setOpenModal(false)
// //         setData(initialState)
// //         setIsEditing(false)
// //     }

// //     const onChangeHandler = (e) => {
// //         const { name, value } = e.target
// //         setData({ ...data, [name]: value })
// //     }

// //     const onClickViewProfile = (emp) => {
// //         const { _id, img, name, phone, email, gender, dateOfBirth, education, role, joiningDate, address } = emp
// //         setOpenModal(true)
// //         setData({
// //             ...data,
// //             id: _id,
// //             img,
// //             name,
// //             phone,
// //             email,
// //             gender,
// //             dateOfBirth,
// //             education,
// //             role,
// //             joiningDate,
// //             address
// //         })
// //     }

// //     const onSaveHandler = async () => {
// //         const { id, img, name, phone, email, gender, dateOfBirth, education, role, joiningDate, address } = data
// //         if (!id || !img || !name || !phone || !email || !gender || !dateOfBirth || !education || !role || !joiningDate || !address) {
// //             toast.error('Fill all Feilds!')
// //             return
// //         }
// //         else {
// //             try {
// //                 let headers = {
// //                     "Content-Type": "application/json",
// //                     "userAgent": "altaNeo"
// //                 }
// //                 let body = JSON.stringify({
// //                     id,
// //                     img,
// //                     name,
// //                     phone,
// //                     email,
// //                     gender,
// //                     dateOfBirth,
// //                     education,
// //                     role,
// //                     joiningDate,
// //                     address
// //                 })
// //                 let response = await ApiCaller(body, headers, '/emp/updateEmpInfo')
// //                 if (response.statusCode == '000') {
// //                     setOpenModal(false)
// //                     toast.success(response.message)
// //                     setIsEditing(false)
// //                     setData(initialState)
// //                     fetchData()
// //                 }
// //                 else {
// //                     toast.error(response.message)
// //                     setIsEditing(false)
// //                 }
// //             } catch (error) {
// //                 console.log('error--', error)
// //             }
// //         }

// //     }

// //     const onEditHandler = () => {
// //         setIsEditing(true)
// //     }



// //     const fetchData = async () => {
// //         setEmployee([])
// //         let headers = {}
// //         let body = {}
// //         try {
// //             let response = await ApiCaller(body, headers, '/emp/empList')
// //             if (response.statusCode === '000') {
// //                 setEmployee(response.data);
// //             } else {
// //                 setEmployee([])
// //             }
// //         } catch (e) {
// //             console.log(e)
// //         }
// //     }

// //     useEffect(() => {
// //         fetchData()
// //     }, [])

// //     useEffect(() => {
// //         if (!email || !user) {
// //             navigate('/')
// //             toast.error('Please Login First')
// //         }
// //     }, [])



// //     return (
// //         <>
// //             <div class="justify-center items-start h-auto dark:bg-gray-700 bg-gray-200 py-12 px-5">
// //                 {employee.length === 0 ? (
// //                     <h2>No employees found.</h2>
// //                 ) : (
// //                     <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// //                         {employee.map((emp, index) => (
// //                             <div key={index} class="max-w-sm bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
// //                                 <div class="border-b px-4 pb-6">
// //                                     <div class="text-center my-4">
// //                                         <img
// //                                             class="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 mx-auto my-4"
// //                                             src={emp.img}
// //                                             alt=""
// //                                         />
// //                                         <div class="py-1">
// //                                             <h3 class="font-bold text-2xl text-gray-800 dark:text-white mb-1">{emp.name}</h3>
// //                                             <div class="inline-flex text-gray-700 dark:text-gray-300 items-center">
// //                                                 {emp.role}
// //                                             </div>
// //                                         </div>
// //                                     </div>
// //                                     <div class="flex gap-2 px-2">
// //                                         <button class="flex-1 rounded-full border-2 border-gray-400 dark:border-gray-700 font-semibold text-black dark:text-white px-4 py-2">
// //                                             <a href={`mailto:${emp.email}`}>
// //                                                 Email
// //                                             </a>
// //                                         </button>
// //                                         <button class="flex-1 rounded-full bg-blue-600 dark:bg-blue-800 text-white dark:text-white antialiased font-bold hover:bg-blue-800 dark:hover:bg-blue-900 px-4 py-2"
// //                                             onClick={() => onClickViewProfile(emp)}>
// //                                             View
// //                                         </button>
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         ))}
// //                     </div>
// //                 )}
// //             </div>

// //             <Modal
// //                 isOpen={openModal}
// //                 onRequestClose={onCloseModal}
// //                 contentLabel="Example Modal"
// //                 className='overflow:hidden'
// //             >
// //                 <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
// //                     <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl h-[90vh]">
// //                         <div className='cursor-pointer'>
// //                             <RxCross2 className="absolute top-2 right-2 cursor-pointer"
// //                                 onClick={onCloseModal}
// //                             />
// //                         </div>
// //                         <div className="flex flex-col h-full">
// //                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
// //                                 <div className="bg-white p-4 rounded-md">
// //                                     <h2 className="block text-sm text-muted leading-6 text-black pb-2">
// //                                         <b className="text-blue-500">PERSONAL</b> Details
// //                                     </h2>
// //                                     <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div>

// //                                     <div className="max-w-2xl">
// //                                         <div className="grid grid-cols-2 gap-x-10 gap-y-10 mx-4 sm:grid-cols-2">
// //                                             <div>
// //                                                 <img
// //                                                     src={data.img}
// //                                                     alt="Avatar"
// //                                                     className="rounded-circle h-20 w-20"
// //                                                 />
// //                                             </div>
// //                                             <div className="py-3">
// //                                                 <label htmlFor="name" className="block font-semibold text-sm leading-6 text-black">Name</label>
// //                                                 {isEditing ? (
// //                                                     <input
// //                                                         type="text"
// //                                                         name="name"
// //                                                         value={data.name}
// //                                                         onChange={onChangeHandler}
// //                                                         className="border rounded-md p-2 w-full"
// //                                                     />
// //                                                 ) : (
// //                                                     <h6 className="text-gray-600 text-sm">{data.name}</h6>
// //                                                 )}
// //                                             </div>

// //                                             <div className="py-3">
// //                                                 <label htmlFor="phone" className="block font-semibold text-sm leading-6 text-black">Phone</label>
// //                                                 {isEditing ? (
// //                                                     <input
// //                                                         type="text"
// //                                                         name="phone"
// //                                                         value={data.phone}
// //                                                         onChange={onChangeHandler}
// //                                                         className="border rounded-md p-2 w-full"
// //                                                     />
// //                                                 ) : (
// //                                                     <h6 className="text-gray-600 text-sm">{data.phone}</h6>
// //                                                 )}
// //                                             </div>
// //                                             <div className="py-3">
// //                                                 <label htmlFor="email" className="block font-semibold text-sm leading-6 text-black">Email</label>
// //                                                 {isEditing ? (
// //                                                     <input
// //                                                         type="email"
// //                                                         name="email"
// //                                                         value={data.email}
// //                                                         onChange={onChangeHandler}
// //                                                         className="border rounded-md p-2 w-full"
// //                                                     />
// //                                                 ) : (
// //                                                     <h6 className="text-gray-600 text-sm">{data.email}</h6>
// //                                                 )}
// //                                             </div>
// //                                             <div className="">
// //                                                 <label htmlFor="gender" className="block font-semibold text-sm leading-6 text-black">Gender</label>
// //                                                 {isEditing ? (
// //                                                     <select
// //                                                         name="gender"
// //                                                         value={data.gender}
// //                                                         onChange={onChangeHandler}
// //                                                         className="border rounded-md p-2 w-full"
// //                                                     >
// //                                                         <option value="Male">Male</option>
// //                                                         <option value="Female">Female</option>
// //                                                         <option value="Other">Other</option>
// //                                                     </select>
// //                                                 ) : (
// //                                                     <h6 className="text-gray-600 text-sm">{data.gender}</h6>
// //                                                 )}
// //                                             </div>
// //                                             <div className="">
// //                                                 <label htmlFor="DOB" className="block font-semibold text-sm leading-6 text-black">DOB</label>
// //                                                 {isEditing ? (
// //                                                     <input
// //                                                         type="date"
// //                                                         name="dateOfBirth"
// //                                                         value={data.dateOfBirth}
// //                                                         onChange={onChangeHandler}
// //                                                         className="border rounded-md p-2 w-full"
// //                                                     />
// //                                                 ) : (
// //                                                     <h6 className="text-gray-600 text-sm">{data.dateOfBirth}</h6>
// //                                                 )}
// //                                             </div>
// //                                         </div>
// //                                     </div>
// //                                 </div>

// //                                 <div className="bg-white p-4 rounded-md">
// //                                     <h2 className="block text-sm text-muted leading-6 text-black pb-2">
// //                                         <b className="text-blue-500">EDUCATION & WORK</b> Details
// //                                     </h2>
// //                                     <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div>
// //                                     <div className="max-w-2xl">
// //                                         <div className="grid grid-cols-2 gap-x-10 gap-y-10 mx-4 sm:grid-cols-2">
// //                                             <div className="py-3">
// //                                                 <label htmlFor="education" className="block font-semibold text-sm leading-6 text-black">Education</label>
// //                                                 {isEditing ? (
// //                                                     <input
// //                                                         type="text"
// //                                                         name="education"
// //                                                         value={data.education}
// //                                                         onChange={onChangeHandler}
// //                                                         className="border rounded-md p-2 w-full"
// //                                                     />
// //                                                 ) : (
// //                                                     <h6 className="text-gray-600 text-sm">{data.education}</h6>
// //                                                 )}
// //                                             </div>
// //                                             <div className="py-3">
// //                                                 <label htmlFor="designation" className="block font-semibold text-sm leading-6 text-black">Designation</label>
// //                                                 {isEditing ? (
// //                                                     <input
// //                                                         type="text"
// //                                                         name="role"
// //                                                         value={data.role}
// //                                                         onChange={onChangeHandler}
// //                                                         className="border rounded-md p-2 w-full"
// //                                                     />
// //                                                 ) : (
// //                                                     <h6 className="text-gray-600 text-sm">{data.role}</h6>
// //                                                 )}
// //                                             </div>
// //                                             <div className="py-3">
// //                                                 <label htmlFor="department" className="block font-semibold text-sm leading-6 text-black">Address</label>
// //                                                 {isEditing ? (
// //                                                     <input
// //                                                         type="text"
// //                                                         name="address"
// //                                                         value={data.address}
// //                                                         onChange={onChangeHandler}
// //                                                         className="border rounded-md p-2 w-full"
// //                                                     />
// //                                                 ) : (
// //                                                     <h6 className="text-gray-600 text-sm">{data.address}</h6>
// //                                                 )}
// //                                             </div>
// //                                             <div className="py-3">
// //                                                 <label htmlFor="DOJ" className="block font-semibold text-sm leading-6 text-black">DOJ</label>
// //                                                 {isEditing ? (
// //                                                     <input
// //                                                         type="date"
// //                                                         name="joiningDate"
// //                                                         value={data.joiningDate}
// //                                                         onChange={onChangeHandler}
// //                                                         className="border rounded-md p-2 w-full"
// //                                                     />
// //                                                 ) : (
// //                                                     <h6 className="text-gray-600 text-sm">{data.joiningDate}</h6>
// //                                                 )}
// //                                             </div>
// //                                         </div>
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                             <hr className="border-blue-500" />
// //                             <div className="flex justify-between space-x-1 mt-6">
// //                                 <button
// //                                     onClick={onCloseModal}
// //                                     class="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-1 px-4 border border-red-500 hover:border-transparent rounded"
// //                                 >
// //                                     Cancle
// //                                 </button>

// //                                 {isEditing ? (
// //                                     <button
// //                                         onClick={onSaveHandler}
// //                                         className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600"
// //                                     >Save
// //                                     </button>
// //                                 ) : (
// //                                     <button
// //                                         onClick={onEditHandler}
// //                                         className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600"
// //                                     >Edit
// //                                     </button>
// //                                 )
// //                                 }
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </Modal>
// //         </>
// //     )
// // }
// // export default EmployeeList