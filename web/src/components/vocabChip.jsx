import * as React from 'react';

import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Chip , Stack, Box} from '@mui/material';

export default function VocabChip({word, onDelete, onSave}) {
  const handleClick = () => {
    // console.info('You clicked the Chip.');
  };

  const handleDelete = (event) => {
    event.stopPropagation(); // Prevent triggering the chip's onClick
    // console.info('You clicked the delete icon.');
    onDelete()
  };

  const handleSave = (event) => {
    event.stopPropagation(); // Prevent triggering the chip's onClick
    // console.info("You clicked the save icon.");
    onSave()
  };

  return (

    <Chip
    label={
      <Box display="flex" alignItems="center" gap={1} sx={{ cursor: "pointer" }}>
        {/* Word Section */}
        <Box
        //   sx={{
        //     "&:hover": { textDecoration: "underline", color: "blue" },
        //   }}
          onClick={(e) => {
            e.stopPropagation();
            // console.info("You clicked the word.");
          }}
        >
          {word}
        </Box>

        {/* Save Icon */}
        <IconButton
          size="small"
          onClick={handleSave}
          aria-label="save"
          sx={{
            color: "green",
            "&:hover": { color: "darkgreen" },
          }}
        >
          <DoneIcon fontSize="small" />
        </IconButton>

                {/* delete Icon */}
                <IconButton
          size="small"
          onClick={handleDelete}
          aria-label="delete"
          sx={{
            color: "red",
            "&:hover": { color: "darkred" },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    }
    onClick={handleClick}

    // variant="outlined"
    sx={{
      backgroundColor: "white", // White background
      color: "black", // Text color
      border: "1px solid gray", // Border color
      "&:hover": {
        backgroundColor: "white", // Prevent background color change
      },
    }}
  />
 
  );
}
