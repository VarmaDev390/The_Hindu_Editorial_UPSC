import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

const VocabCard = ({ word, meaning, onDelete, onSave }) => {
  return (
    <Card sx={{ maxWidth: 345, margin: '1rem', boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {word}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {meaning}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={onSave}
        >
          Save
        </Button>
        <IconButton color="error" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default VocabCard;
