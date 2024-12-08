import React, { createContext, useEffect, useRef, useState } from "react";
import dayjs from 'dayjs';

export const ContextApp = createContext();

const AppContext = ({ children }) => {
    const [currDate, setCurrDate] = useState(dayjs());
  const [articles, setArticles] = useState([]);
  const [userId, setUserId] = useState("")

 
    return (
      <ContextApp.Provider
        value={{
currDate, setCurrDate, articles, setArticles, userId, setUserId
        }}
      >
        {children}
      </ContextApp.Provider>
    );
  };
  export default AppContext;