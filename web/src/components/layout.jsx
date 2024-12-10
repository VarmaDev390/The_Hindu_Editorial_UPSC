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
import MenuIcon from '@mui/icons-material/Menu';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Grid2,MenuItem,Avatar,Container,Menu,Typography,IconButton,Toolbar,Box,AppBar ,Button, Link, Tooltip, Stack} from "@mui/material";
import AdbIcon from '@mui/icons-material/Adb';
import { useNavigate  } from 'react-router-dom'
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs from 'dayjs';
import { ContextApp } from "../utils/context";
import axios from "axios"
import { useSnackbar } from 'notistack';


const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const styles= {
  buttonStyle: {
    
      my: 2,
      color: 'white',
      display: 'block',
      fontSize: '18px',
      textTransform: 'none', // Keep text casing as is
      backgroundColor: 'transparent', // Initial background
      transition: 'all 0.3s ease', // Smooth transition for hover effect
      '&:hover': {
        backgroundColor: '#cad2c5', // Light gray background on hover
        color: '#1565c0', // Change text color on hover
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow effect
      },
    
  },
  datePickerStyle: {
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
  }
}

function Layout({ children }) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { setCurrDate, currDate, setArticles, userId} = useContext(ContextApp)
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();


  
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

  const handleLogout = () => {
    handleCloseUserMenu()
    localStorage.removeItem('userId')
    enqueueSnackbar(`Successfully LoggedOut`, { variant: 'success' }); 
    navigate("/")
    window.location.reload()

  }

  const handleDeleteAccount = async () => {
    handleCloseUserMenu()

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/delete-user`, {
         
        userId: userId 
      });

      if (response.status !== 200) {
        throw new Error('Failed to delete Account');
      }
    localStorage.removeItem('userId')
    enqueueSnackbar(`Successfully deleted Account`, { variant: 'success' }); 

    navigate("/")
    window.location.reload()

    } catch(error) {
      enqueueSnackbar(`Error deleting Account`, { variant: 'error' });
      console.error('Error deleting Account:', error);
    }
  }



  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden'}}>
    <AppBar position="static" sx={{backgroundColor: '#22333b'}}>
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
              fontFamily: 'Arial, Helvetica, sans-serif',
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
            navigate("/")
          } }>
                  <Typography sx={{ textAlign: 'center' }}>Editorials</Typography>
                </MenuItem>
                <MenuItem onClick={() =>  {
            handleCloseNavMenu()
            navigate("/saved_words")
          } }>
                  <Typography sx={{ textAlign: 'center' }}>My Vocab</Typography>
                </MenuItem>
                <MenuItem onClick={() =>  {
            handleCloseNavMenu()
            navigate("/about")
          } }>
                  <Typography sx={{ textAlign: 'center' }}>About</Typography>
                </MenuItem>

            </Menu>
          </Box>
          {/*web */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
          {/* <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Editorials
          </Typography> */}
                    <Box
      component="img"
      sx={{
        height: 40,
        marginRight: 2, // Adds space to the right of the logo
      }}
      alt="Logo"
      src="/logo.png"
    />
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, marginLeft: 5 }}>
           
              <Button
          
                
          sx={{ ...styles.buttonStyle, marginRight: 2 }}
                onClick={() =>  {
                  handleCloseNavMenu()
                  navigate("/saved_words")
                } }
              >
                My Vocab
              </Button>
              <Button
          
                
          sx={styles.buttonStyle}
                onClick={() =>  {
                  handleCloseNavMenu()
                  navigate("/about")
                } }
              >
                About
              </Button>
           
       
          </Box>
          <Box sx={{ flexGrow: 0 }}>
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Stack direction="row" spacing={2} alignItems="center">
      <MobileDatePicker
        label="Pick Articles By Date"
        defaultValue={currDate}
        minDate={dayjs('2024-11-09')}
        maxDate={dayjs()}
        sx={styles.datePickerStyle}
        onChange={() => {}}
        onAccept={handleDateChange}
      />
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt="Remy Sharp" src="/user.jpg" />
        </IconButton>
      </Tooltip>
    </Stack>
  </LocalizationProvider>
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
    {/* {settings.map((setting) => ( */}
      <MenuItem key="logout" onClick={handleLogout}>
        <Typography sx={{ textAlign: 'center' }}>Logout</Typography>
      </MenuItem>
      <MenuItem key="del acc" onClick={handleDeleteAccount}>
        <Typography sx={{ textAlign: 'center' }}>Delete Account</Typography>
      </MenuItem>
    {/* ))} */}
  </Menu>
</Box>

          </Box>
        </Toolbar>
      </Container>
    </AppBar>

      {/* Page Content */}
      <Box style= {{ backgroundColor: '#415a77', flexGrow: 1,padding: 0, margin: 0 ,  width: '100%' }}>
  <Container  maxWidth="lg" sx={{mt:4,  color: 'white' }}>
    {children}
  </Container>
  </Box>
  

    {/* Footer */}
    <footer style={{ backgroundColor: '#f0f0f0', padding: '20px', textAlign: 'center' }}>
      <Grid2 container spacing={3} justifyContent="center" alignItems="center">
        <Grid2 sx={{xs:4,sm:6, md:6, textAlign:"center"}} >
          <Typography variant="h6">Developed by M Ravi Teja Varma</Typography>
          
        </Grid2>
        
        <Grid2 container spacing={2} direction={{ xs: 'row', sm: 'row' }} justifyContent="center">
  <Grid2 sx={{xs:4, sm:4,md:6,}}>
    <Typography variant="body2" color="textSecondary">ReactJS</Typography>
  </Grid2>
  <Grid2 sx={{xs:4, sm:4,md:6,}}>
    <Typography variant="body2" color="textSecondary">NodeJS</Typography>
  </Grid2>
  <Grid2 sx={{xs:4, sm:4,md:6,}}>
    <Typography variant="body2" color="textSecondary">Python</Typography>
  </Grid2>
  <Grid2 sx={{xs:4, sm:4,md:6,}}>
    <Typography variant="body2" color="textSecondary">MongoDB</Typography>
  </Grid2>
  <Grid2 sx={{xs:4, sm:4,md:6,}}>
    <Typography variant="body2" color="textSecondary">Express</Typography>
  </Grid2>
</Grid2>

      </Grid2>

      <Grid2 container spacing={3} justifyContent="center" style={{ marginTop: '20px' }}>
        <Grid2 >
          <IconButton href="https://github.com/VarmaDev390" target="_blank" color="primary">
            <GitHubIcon />
          </IconButton>
        </Grid2>
        <Grid2 >
          <IconButton href="https://www.linkedin.com/in/malladi-ravi-varma-63a46a216/" target="_blank" color="primary">
            <LinkedInIcon />
          </IconButton>
        </Grid2>
        {/* <Grid2 >
          <IconButton href="https://twitter.com/[your-twitter]" target="_blank" color="primary">
            <TwitterIcon />
          </IconButton>
        </Grid2> */}
      </Grid2>

      <Typography variant="body2" color="textSecondary" style={{ marginTop: '20px' }}>
        © {new Date().getFullYear()} [Editorial]. All rights reserved.
      </Typography>
      {/* <Typography variant="body2" color="textSecondary">
        <Link href="https://www.your-portfolio.com" target="_blank">Portfolio</Link> | <Link href="mailto:your-email@example.com">Contact</Link>
      </Typography> */}

      <Typography variant="body2" color="textSecondary" style={{ marginTop: '20px' }}>
        API credits: <Link href="https://dictionaryapi.com/" target="_blank">Merriam-Webster</Link> | <Link href="https://api-inference.huggingface.co/models/facebook/bart-large-cnn" target="_blank">HuggingFace(Bart)</Link>
      </Typography>
    </footer>
    </div>
  );
}
export default Layout;
