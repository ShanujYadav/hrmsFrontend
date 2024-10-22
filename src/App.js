import { Route, Routes } from 'react-router-dom';
import './App.css';
import { AdminContextProvider } from './components/admin/AdminContext';
import Admin from './components/admin/Admin';
import Register from './components/register/Register';
import Login from './components/login/Login';
import { EmpContextProvider } from './components/employee/EmpContext';
import Employee from './components/employee/Employee';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/adminDashboard/*" element={
            <AdminContextProvider>
              <Admin />
            </AdminContextProvider>}
        />
        <Route
          path="/empDashboard/*" element={
            <EmpContextProvider>
              <Employee />
            </EmpContextProvider>} />
        <Route path="*" element={<div>Module Not Found</div>} />
      </Routes>
    </>
  )
}
export default App