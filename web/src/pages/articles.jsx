import React,{ useState, useEffect, useContext, useRef} from 'react'
import axios from 'axios'
import Layout from '../components/layout';
import { Typography, Grid2, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField ,Box } from '@mui/material';
import ArticleCard from '../components/articleCard';
import { ContextApp } from '../utils/context';
import { useSnackbar } from 'notistack';


const styles= {
  buttonStyle:{
    backgroundColor: "#adb5bd",
    color: "black",
    textTransform: "none", // Keeps the text casing as is
    fontSize: "14px",
    padding: "5px 15px",
    borderRadius: "8px", // Slightly rounded corners
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
    "&:hover": {
      backgroundColor: "#1565c0",
      color: "white", // Darker shade on hover
      boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.2)", // Enhanced shadow on hover
    },
    "&:active": {
      backgroundColor: "#0d47a1", // Even darker shade on click
    },
  },
  titleStyle: {
    paddingBottom: 1
  },
  contentStyle: {
    paddingTop: 1, paddingBottom: 1 
  },
  actionStyle: {
     gap: 1.5, paddingBottom: 2, paddingRight: 3
  }
 
  
}

const ArticlesPage = () => {
  const { currDate, articles, setArticles, userId, setUserId} = useContext(ContextApp)

  const [loading, setLoading] = useState(articles.length === 0 ? true: false);
  const [dialogStep, setDialogStep] = useState("choose");
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newUserId, setNewUserId] = useState("");
  const [existingUserId, setExistingUserId] = useState("");
  const [userExists, setUserExists] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  // console.log("url", import.meta.env.VITE_BACKEND_URL)

  // const articlesCache = useRef({});

  useEffect(() => {
    // console.log("inside useEffect")
    // console.log(articles,"articles")
    const storedUserId = localStorage.getItem("userId");

    if (storedUserId) {
      setUserId(storedUserId); // Set userId from localStorage if available
    } else {
      setOpenDialog(true); // Open dialog if userId is not in localStorage
    }
    const dateKey = currDate.format('YYYY-MM-DD');


    const fetchData = async () => {
      setLoading(true); // Set loading state
      // console.log("iside fetch");

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/get-articles`,
          { params: { date: dateKey, userId: userId } } // Add currDate as query parameter
        );
        
        setArticles(response.data.articles);
        // console.log("response.data",response.data.articles)
      } catch (err) {
        console.error(err);
        setError("Failed to load articles");
      } finally {
        setLoading(false); // Set loading state to false after fetching or error
      }
    };

    if (articles.length === 0) {
     fetchData();
      
    }
  }, [currDate]); 

  const handleSaveUserId = async () => {
    if (newUserId.trim()) {
      try {
        // Check if the newUserId is unique by calling the backend API
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-users`);
        const existingUserIds = response.data.users;

        if (existingUserIds.includes(newUserId)) {
          // If the userId already exists, show error message
          setUserExists(true);
          enqueueSnackbar(`User already exists`, { variant: 'error' });
          // alert("User already exists");
        } else {
         
          setOpenDialog(false); // Close the dialog
          const resp = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/add-user`, {
            userId:newUserId,
            password:""
          });
           // If userId is unique, proceed with saving it
           setUserId(newUserId);
           localStorage.setItem("userId", newUserId); // Save userId to localStorage
           setOpenDialog(false);
           setUserExists(false);
           enqueueSnackbar(`New user created`, { variant: 'success' }); 
           
        }
      } catch (error) {
        console.error("Error verifying user ID uniqueness", error);
        alert("There was an error verifying the uniqueness of the user ID.");
      }
    } else {
      alert("Please enter a valid unique name.");
    }
  };

  const handleUserCreation = async () => {
    setIsCreatingUser(true); // Start loading
    setOpenDialog(false)
    try {
      await handleSaveUserId(); // Replace with your user creation logic
      // Additional success handling
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setIsCreatingUser(false); // Stop loading
    }
  };

  const handleExistingUserSave = () => {
    if (existingUserId.trim()) {
      // Directly set the existing userId
      setUserId(existingUserId);
      localStorage.setItem("userId", existingUserId); // Save userId to localStorage
      setOpenDialog(false);
      enqueueSnackbar(`Successfully loggedIn`, { variant: 'success' }); 
           
    } else {
      alert("Please enter a valid user ID.");
    }
  };

  const renderDialogContent = () => {
    switch (dialogStep) {
      case "choose":
        return (
          <>
            <DialogTitle sx={styles.titleStyle}>Select an Option</DialogTitle >
            <DialogContent sx={styles.contentStyle}>
            <Typography variant="body2" >
          Are you a new user or an existing user?
        </Typography>
            </DialogContent>
            <DialogActions sx={styles.actionStyle}>
              <Button variant="contained"
      color="primary"
     sx={styles.buttonStyle} 
      onClick={() => setDialogStep("existing")}>Existing User</Button>
              <Button  sx={styles.buttonStyle} onClick={() => setDialogStep("new")}>New User</Button>
            </DialogActions>
          </>
        );

      case "new":
        return (
          <>
            <DialogTitle sx={styles.titleStyle}>Enter Unique Name</DialogTitle>
            <DialogContent sx={styles.contentStyle}>
              <TextField
                autoFocus
                margin="dense"
                label="New User ID"
                fullWidth
                variant="outlined"
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                error={userExists}
                helperText={userExists ? "This username is already taken." : ""}
              />
            </DialogContent>
            <DialogActions sx={styles.actionStyle}>
              <Button sx={styles.buttonStyle} onClick={() => setDialogStep("choose")}>Back</Button>
              <Button sx={styles.buttonStyle} onClick={handleUserCreation}>Save</Button>
            </DialogActions>
          </>
        );

      case "existing":
        return (
          <>
            <DialogTitle sx={styles.titleStyle}>Enter Existing User ID</DialogTitle>
            <DialogContent sx={styles.contentStyle}>
              <TextField
                autoFocus
                margin="dense"
                label="Existing User ID"
                fullWidth
                variant="outlined"
                value={existingUserId}
                onChange={(e) => setExistingUserId(e.target.value)}
              />
            </DialogContent>
            <DialogActions sx={styles.actionStyle}>
              <Button sx={styles.buttonStyle} onClick={() => setDialogStep("choose")}>Back</Button>
              <Button sx={styles.buttonStyle} onClick={handleExistingUserSave}>Save</Button>
            </DialogActions>
          </>
        );

      default:
        return null;
    }
  };

    return (


      <Layout>
      <Box
        sx={{
          display: openDialog ? 'none' : 'block',
          filter: openDialog ? 'blur(15px)' : 'none', // Blur background when dialog is open
        }}
      >
        {loading && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              mt:20
            }}
          >
            <Typography variant="h6" sx={{ marginTop: 2, color: '#ffffff' }}>
              Please wait, we are summarizing articles for you...
            </Typography>
          </Box>
        )}

{isCreatingUser && (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1500,
    }}
  >
    <Typography variant="h6" sx={{ color: '#ffffff' }}>
      Creating user, please wait...
    </Typography>
  </Box>
)}

        {!loading && error && <Typography color="error">{error}</Typography>}

        {!loading && !error && articles.length > 0 && userId && (
          <Grid2 container spacing={3} sx={{ mb: 3 }}>
            {articles.map((article, index) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <ArticleCard data={article} />
              </Grid2>
            ))}
          </Grid2>
        )}

        {!loading && !error && articles.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 20
            }}
          >
            <Typography variant="h6" sx={{ marginTop: 2, color: '#ffffff' }}>
              No articles found for the selected date, choose another date
            </Typography>
          </Box>
        )}
      </Box>

      {/* User ID Dialog */}
      <Dialog
        open={openDialog}
        onClose={(event, reason) => {
          // Prevent dialog from closing unless explicitly closed programmatically
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            setOpenDialog(false);
          }
        }}
        disableEscapeKeyDown
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '16px',
            width: { xs: '90%', sm: '60%', md: '50%' }, // Set dialog size for different screen sizes
          },
        }}
      >
        {renderDialogContent()}
      </Dialog>
    </Layout>

    )
}




export default ArticlesPage;


