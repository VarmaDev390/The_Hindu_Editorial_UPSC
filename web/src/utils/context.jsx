import React, { createContext, useEffect, useRef, useState } from "react";
import dayjs from 'dayjs';

export const ContextApp = createContext();

const AppContext = ({ children }) => {
    const [currDate, setCurrDate] = useState(dayjs());
 
    return (
      <ContextApp.Provider
        value={{
currDate, setCurrDate
        }}
      >
        {children}
      </ContextApp.Provider>
    );
  };
  export default AppContext;