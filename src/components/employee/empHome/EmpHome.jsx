import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';


const EmpHome = () => {
  const navigate = useNavigate()
  const id = sessionStorage.getItem('id')
  const name = sessionStorage.getItem('name')
  const accessToken = sessionStorage.getItem('accessToken')


  useEffect(() => {
    if (!name || !id || !accessToken) {
      navigate('/')
      toast.error('Please Login First')
    }
  }, [])

  return (
    <div >
      <div class="mt-0 bg-white p-2 rounded-lg shadow">
        <header class="flex justify-between items-center">
          <div class="text-xl font-semibold">Welcome, {name}</div>
          
          {/* <div class="flex items-center space-x-4">
            <div class="text-gray-700">Notifications</div>
            <div class="h-8 w-8 bg-gray-300 rounded-full"></div>
          </div> */}

        </header>
        
{/* 
        <main class="flex-1 p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-lg shadow">
              <h2 class="text-lg font-semibold mb-2">Profile Completion</h2>
              <div class="w-full bg-gray-200 rounded-full h-4">
                <div class="bg-blue-600 h-4 rounded-full"></div>
              </div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow">
              <h2 class="text-lg font-semibold mb-2">Current Projects</h2>
              <p>3 Active Projects</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow">
              <h2 class="text-lg font-semibold mb-2">Recent Activity</h2>
              <p>Last login: 2 days ago</p>
            </div>
          </div>

          <div class="mt-6 bg-white p-6 rounded-lg shadow">
            <h2 class="text-lg font-semibold mb-4">Employee List</h2>
            <table class="min-w-full bg-white">
              <thead class="bg-gray-200">
                <tr>
                  <th class="py-2 px-4 border-b">Name</th>
                  <th class="py-2 px-4 border-b">Position</th>
                  <th class="py-2 px-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="py-2 px-4 border-b">John Doe</td>
                  <td class="py-2 px-4 border-b">Software Engineer</td>
                  <td class="py-2 px-4 border-b text-green-600">Active</td>
                </tr>
                <tr>
                  <td class="py-2 px-4 border-b">Jane Smith</td>
                  <td class="py-2 px-4 border-b">Product Manager</td>
                  <td class="py-2 px-4 border-b text-red-600">Inactive</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main> */}
      </div>
    </div>)
}

export default EmpHome