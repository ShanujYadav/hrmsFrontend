import React, { useState, createContext, useEffect } from "react";

export const AdminContext = createContext()

export const AdminContextProvider = (props) => {
  
  const [data, setData] = useState({
    totalEmp: 0,
    pendingReq: 0,
  })

  return (
    <AdminContext.Provider value={[data, setData]}>
      {props.children}
    </AdminContext.Provider>
  );
};
