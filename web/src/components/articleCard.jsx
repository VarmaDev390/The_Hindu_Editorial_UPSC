import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Chip,
  Stack,
} from '@mui/material';
// import StarIcon from '@mui/icons-material/Star';
// import NewReleasesIcon from '@mui/icons-material/NewReleases';

const ArticleCard = () => {
  return (
    <Card sx={{ maxWidth: 345, borderRadius: 2, boxShadow: 3 }}>
      <CardMedia
        component="img"
        height="140"
        image="https://source.unsplash.com/random/345x140/?powerlines" // Replace with your image URL
        alt="Power lines"
      />
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Chip
            // icon={<NewReleasesIcon />}
            label="NEW"
            color="warning"
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
          <Typography variant="overline" color="textSecondary">
            CATEGORY • ARTICLE
          </Typography>
        </Stack>
        <Typography variant="h6" component="div" fontWeight="bold" mt={1}>
          Compliance Document for Multi-Channeled Firmware
        </Typography>
        <Typography variant="body2" color="textSecondary" mt={1}>
          Gathered by gravity star stuff harvesting star light the ash of stellar alchemy vastness is …
          <Typography variant="body2" color="primary" component="span" sx={{ cursor: 'pointer' }}>
            + Read More
          </Typography>
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" fullWidth>
          READ ARTICLE
        </Button>
      </CardActions>
      <Box px={2} py={1} display="flex" justifyContent="space-between" borderTop={1} borderColor="divider">
        <Typography variant="caption" color="textSecondary">
          PROVIDED BY: Schiller-Stroman
        </Typography>
        <Typography variant="caption" color="textSecondary">
          UPDATED: 09.30.20
        </Typography>
      </Box>
    </Card>
  );
};

export default ArticleCard;