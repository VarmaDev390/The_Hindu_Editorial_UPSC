import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import axios from "axios";

const UserDialog = ({ open, onClose, onSaveUserId }) => {
  const [dialogStep, setDialogStep] = useState("choose");
  const [newUserId, setNewUserId] = useState("");
  const [existingUserId, setExistingUserId] = useState("");
  const [userExists, setUserExists] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleUserCreation = async () => {
    if (!newUserId.trim()) {
      alert("Please enter a valid unique name.");
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/get-users`
      );
      const existingUserIds = response.data.users;

      if (existingUserIds.includes(newUserId)) {
        setUserExists(true);
        enqueueSnackbar(`User already exists`, { variant: "error" });
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/add-user`, {
          userId: newUserId,
          password: "",
        });
        enqueueSnackbar(`New user created`, { variant: "success" });
        onSaveUserId(newUserId);
        onClose();
      }
    } catch (error) {
      console.error("Error creating user:", error);
      enqueueSnackbar("Failed to create user. Try again.", { variant: "error" });
    }
  };

  const handleExistingUserSave = async () => {
    if (!existingUserId.trim()) {
      alert("Please enter a valid user ID.");
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/get-users`
      );
      const existingUserIds = response.data.users;

      if (existingUserIds.includes(existingUserId)) {
        enqueueSnackbar(`Successfully logged in`, { variant: "success" });
        onSaveUserId(existingUserId);
        onClose();
      } else {
        enqueueSnackbar(`User ID not found. Please try as New user.`, {
          variant: "error",
        });
        setDialogStep("choose");
      }
    } catch (error) {
      console.error("Error verifying user ID:", error);
      enqueueSnackbar("Error verifying user ID. Try again.", { variant: "error" });
    }
  };

  const renderDialogContent = () => {
    switch (dialogStep) {
      case "choose":
        return (
          <>
            <DialogTitle>Select an Option</DialogTitle>
            <DialogContent>
              <Typography variant="body2">
                Are you a new user or an existing user?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogStep("existing")}>
                Existing User
              </Button>
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
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                error={userExists}
                helperText={userExists ? "This username is already taken." : ""}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogStep("choose")}>Back</Button>
              <Button onClick={handleUserCreation}>Save</Button>
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
                value={existingUserId}
                onChange={(e) => setExistingUserId(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogStep("choose")}>Back</Button>
              <Button onClick={handleExistingUserSave}>Login</Button>
            </DialogActions>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={() => {
      
      
        onClose();
      }}
    // disableEscapeKeyDown
    sx={{
      '& .MuiPaper-root': {
        borderRadius: '16px',
        width: { xs: '90%', sm: '60%', md: '50%' }, // Set dialog size for different screen sizes
      },
    }}>
      {renderDialogContent()}
    </Dialog>
  );
};

export default UserDialog;
