// import React, { useContext } from "react";
// import { AppBar, Toolbar, Typography, Container, Box, TextField } from "@mui/material";
// import { Link } from 'react-router-dom'
// import { DatePicker } from '@mui/x-date-pickers';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
// import dayjs from 'dayjs';
// import { ContextApp } from "../utils/context";

// const Layout = ({ children }) => {
    // const { setCurrDate, currDate, setArticles} = useContext(ContextApp)

    // const handleDateChange = (newDate) => {
    //   setArticles([])
    //     setCurrDate(newDate);
    //   };

//   return (

//   <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
//   {/* Responsive Header */}
//   <AppBar position="fixed" sx={{ backgroundColor: '#1b263b' }}>
//     <Toolbar sx={{ px: 2, width: '100%', maxWidth: 'lg', mx: 'auto' }}>
//       <Typography variant="h4" component="div" sx={{ color: '#ffffff' }}>
//         Your Editorials
//       </Typography>

//       {/* Right-aligned Links */}
//       <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
//         <Typography variant="h6" component="div" sx={{ color: '#ffffff' }}>
          // <Link to="/saved_words" style={{ textDecoration: 'none', color: '#ffffff' }}>
          //   SavedWords
          // </Link>
//         </Typography>
        // <LocalizationProvider dateAdapter={AdapterDayjs}>
        //   <MobileDatePicker
        //     label="Pick Articles By Date"
        //     defaultValue={currDate}
        //     minDate={dayjs('2024-11-09')}
        //     maxDate={dayjs()}
        //     sx={{
        //       '& .MuiInputBase-root': { backgroundColor: 'white' },
        //       '& .MuiInputLabel-root': { color: '#333' },
        //       '& .MuiOutlinedInput-root': { borderColor: '#ccc' }
        //     }}
        //     onChange={handleDateChange}
        //   />
        // </LocalizationProvider>
//       </Box>
//     </Toolbar>
//   </AppBar>

  // {/* Page Content */}
  // <Container maxWidth="lg" sx={{ mt: 10, flexGrow: 1, backgroundColor: '#415a77' }}>
  //   {children}
  // </Container>

  // {/* Footer */}
  // <footer style={{ backgroundColor: '#f0f0f0', padding: '20px', textAlign: 'center' }}>
  //   <Typography variant="body2" color="textSecondary">
  //     © 2023 Your Company Name. All rights reserved.
  //   </Typography>
  // </footer>
// </div>
//   );
// };

// export default Layout;

import React, { useState, useContext } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useNavigate  } from 'react-router-dom'
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs from 'dayjs';
import { ContextApp } from "../utils/context";

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function Layout({ children }) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { setCurrDate, currDate, setArticles} = useContext(ContextApp)
  const navigate = useNavigate();

  
  const handleDateChange = (newDate) => {
      setArticles([])
      setCurrDate(newDate);
      navigate("/");
    };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };




  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <AppBar position="fixed" sx={{backgroundColor: '#22333b'}}>
      <Container maxWidth="lg" >
        <Toolbar disableGutters>
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <Typography
            variant="h4"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Editorials
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              
                <MenuItem onClick={() =>  {
            handleCloseNavMenu()
            navigate("/saved_words")
          } }>
                  <Typography sx={{ textAlign: 'center' }}>My Vocab</Typography>
                </MenuItem>
            

            </Menu>
          </Box>
          {/*web */}
          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Editorials
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
           
              <Button
          
                
                sx={{ my: 2, color: 'white', display: 'block' }}
                onClick={() =>  {
                  handleCloseNavMenu()
                  navigate("/saved_words")
                } }
              >
                My Vocab
              </Button>
           
       
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {/* <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu> */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            label="Pick Articles By Date"
            defaultValue={currDate}
            minDate={dayjs('2024-11-09')}
            maxDate={dayjs()}
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: '#fefae0',
                fontSize: '1rem', // Reduce font size
                height: '40px', // Adjust input height
                minHeight: 'unset', // Ensure no min height conflicts
                width: "165px"
              },
              '& .MuiInputLabel-root': {
                color: 'black',
                fontSize: '1rem', // Reduce label font size
              },
              '& .MuiOutlinedInput-root': {
                borderColor: '#ccc',
                padding: '0 0px', // Reduce padding
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: '4px', // Adjust border radius if needed
              },
              '& .Mui-focused .MuiInputLabel-root': {
                color: 'white',
              },
            }}
            onChange={() => {}}
            onAccept={handleDateChange}
          />
        </LocalizationProvider>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>

      {/* Page Content */}
      <section style= {{ backgroundColor: '#415a77', flexGrow: 1, }}>
  <Container maxWidth="lg" sx={{mt:10}}>
    {children}
  </Container>
  </section>
  

    {/* Footer */}
    <footer style={{ backgroundColor: '#f0f0f0', padding: '20px', textAlign: 'center' }}>
    <Typography variant="body2" color="textSecondary">
      © 2023 Your Company Name. All rights reserved.
    </Typography>
  </footer>
    </div>
  );
}
export default Layout;
