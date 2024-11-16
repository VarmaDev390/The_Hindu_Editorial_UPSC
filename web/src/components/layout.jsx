import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Container, Box, TextField } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs from 'dayjs';
import { ContextApp } from "../utils/context";

const Layout = ({ children }) => {
    const { setCurrDate} = useContext(ContextApp)

    const handleDateChange = (newDate) => {
        setCurrDate(newDate);
      };

  return (
    <div>
      {/* Responsive Header */}
      <AppBar position="fixed">
        <Toolbar sx={{ px: 2, width: "100%", maxWidth: "lg", mx: "auto" }}>
        <Typography variant="h6" component="div">
    The Hindu Editorials
  </Typography>

  {/* Right-aligned Links */}
  <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
  <LocalizationProvider dateAdapter={AdapterDayjs}>
       
               <MobileDatePicker 
               label="Pick Articles By Date" 
               defaultValue={dayjs()} 
               minDate={dayjs('2024-11-09')} maxDate={dayjs()} sx={{ '& .MuiInputBase-root': { backgroundColor: 'white' } }}
               onChange={handleDateChange}
               />
            </LocalizationProvider>
  </Box>
        </Toolbar>
      </AppBar>

      {/* Page Content */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {children}
      </Container>
    </div>
  );
};

export default Layout;
