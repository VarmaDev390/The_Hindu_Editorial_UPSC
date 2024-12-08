import React,{ useState, useEffect, useContext, useRef} from 'react'
import axios from 'axios'
import Layout from '../components/layout';
import { Typography, Grid2, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField ,Box } from '@mui/material';
import ArticleCard from '../components/articleCard';
import { ContextApp } from '../utils/context';

const ArticlesPage = () => {
  const { currDate, articles, setArticles, userId, setUserId} = useContext(ContextApp)

  const [loading, setLoading] = useState(articles.length === 0 ? true: false);
  const [dialogStep, setDialogStep] = useState("choose");
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newUserId, setNewUserId] = useState("");
  const [existingUserId, setExistingUserId] = useState("");
  const [userExists, setUserExists] = useState(false);
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
           alert("New user created");
        }
      } catch (error) {
        console.error("Error verifying user ID uniqueness", error);
        alert("There was an error verifying the uniqueness of the user ID.");
      }
    } else {
      alert("Please enter a valid unique name.");
    }
  };

  const handleExistingUserSave = () => {
    if (existingUserId.trim()) {
      // Directly set the existing userId
      setUserId(existingUserId);
      localStorage.setItem("userId", existingUserId); // Save userId to localStorage
      setOpenDialog(false);
    } else {
      alert("Please enter a valid user ID.");
    }
  };

  const renderDialogContent = () => {
    switch (dialogStep) {
      case "choose":
        return (
          <>
            <DialogTitle>Select an Option</DialogTitle>
            <DialogContent>
              <p>Are you a new user or an existing user?</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogStep("existing")}>Existing User</Button>
              <Button onClick={() => setDialogStep("new")}>New User</Button>
            </DialogActions>
          </>
        );

      case "new":
        return (
          <>
            <DialogTitle>Enter Unique Name</DialogTitle>
            <DialogContent>
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
            <DialogActions>
              <Button onClick={() => setDialogStep("choose")}>Back</Button>
              <Button onClick={handleSaveUserId}>Save</Button>
            </DialogActions>
          </>
        );

      case "existing":
        return (
          <>
            <DialogTitle>Enter Existing User ID</DialogTitle>
            <DialogContent>
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
            <DialogActions>
              <Button onClick={() => setDialogStep("choose")}>Back</Button>
              <Button onClick={handleExistingUserSave}>Save</Button>
            </DialogActions>
          </>
        );

      default:
        return null;
    }
  };

    return (


<Layout>
  {/* <Typography variant="h4" gutterBottom>
    Articles
  </Typography> */}
  
  {loading && (
    <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
    }}
  >
    {/* <img
      src="https://giphy.com/gifs/perfect-loops-17mNCcKU1mJlrbXodo" // Replace with your no-copyright GIF URL
      alt="Loading..."
      style={{ width: "150px", height: "150px" }}
    /> */}
    <Typography variant="h6" sx={{ marginTop: 2, color:"#ffffff" }}>
      Please wait, we are summarizing articles...
    </Typography>
  </Box>
  )}

  {!loading && error && (
    <Typography color="error">{error}</Typography>
  )}

  {!loading && !error && articles.length > 0 && (
    <Grid2 container spacing={3}>
      {articles.map((article, index) => (
        <Grid2 size={{ xs: 12, sm:6, md: 4 }} key={index}>
          <ArticleCard data={article} />
        </Grid2>
      ))}
    </Grid2>
  )}

  {!loading && !error && articles.length === 0 && (
     <Box
     sx={{
       display: "flex",
       flexDirection: "column",
       alignItems: "center",
       justifyContent: "center",
       height: "100vh",
     }}
   >
     {/* <img
       src="https://via.placeholder.com/300" // Replace with your chosen no-copyright image URL
       alt="No articles found"
       style={{ width: "300px", height: "300px" }}
     /> */}
     <Typography variant="h6" sx={{ marginTop: 2, color:"#ffffff" }}>
       No articles found for the selected date.
     </Typography>
   </Box>
  )}

        {/* User ID Dialog */}
        {/* <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Enter Unique User Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="User ID"
            fullWidth
            variant="outlined"
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveUserId} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog> */}
       <Dialog open={openDialog} onClose={(event, reason) => {
    // Prevent dialog from closing unless explicitly closed programmatically
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setOpenDialog(false);
    }
  }}
  disableEscapeKeyDown>
        {renderDialogContent()}
      </Dialog>
</Layout>

    )
}

export default ArticlesPage
