import React, { useState, createContext } from "react";
import { useSelector } from "react-redux";

export const EmpContext = createContext()

export const EmpContextProvider = (props) => {
  const profileDetails = useSelector((state) => state.profile.empInfo)
  
  const [data, setData] = useState({
    gateway: "",
    amount: "",
  })
  
  return (
    <EmpContext.Provider value={[data, setData, profileDetails]}>
      {props.children}
    </EmpContext.Provider>
  );
};
