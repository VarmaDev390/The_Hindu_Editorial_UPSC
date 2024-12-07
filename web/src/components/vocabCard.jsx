// import React from 'react';
// import { Card, CardContent, CardActions, Typography, Button, IconButton } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import SaveIcon from '@mui/icons-material/Save';

// const VocabCard = ({ word, meaning, onDelete, onSave }) => {
//   return (
//     <Card sx={{ maxWidth: 345, margin: '1rem', boxShadow: 3 }}>
//       <CardContent>
//         <Typography variant="h5" component="div" gutterBottom>
//           {word}
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           {meaning}
//         </Typography>
//       </CardContent>
//       <CardActions sx={{ justifyContent: 'flex-end' }}>
//         <Button
//           variant="contained"
//           color="primary"
//           startIcon={<SaveIcon />}
//           onClick={onSave}
//         >
//           Save
//         </Button>
//         <IconButton color="error" onClick={onDelete}>
//           <DeleteIcon />
//         </IconButton>
//       </CardActions>
//     </Card>
//   );
// };

// export default VocabCard;
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// const bull = (
//   <Box
//     component="span"
//     sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
//   >
//     •
//   </Box>
// );

export default function VocabCard({word, meaning}) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        {/* <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
          Word of the Day
        </Typography> */}
        <Typography variant="h5" component="div">
          {word}
        </Typography>
        {/* <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography> */}
        <Typography variant="body2">
          {meaning}
        </Typography>
      </CardContent>
      {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
}

