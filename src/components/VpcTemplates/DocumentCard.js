import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const cardStyleSolid = {
  width: "300px",
  borderRadius: "16px",
  border: `1px solid #E6E6EB`,
  backgroundColor: '#F4F5F7'
}

const cardActionsStyle = {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
};

export default function DocumentCard(props) {
  const name = props.name;
  const lastUpdated = props.lastUpdated;
  const nodeCount = props.nodeCount;
  const onView = props.onView;
  const onDelete = props.onDelete;

  return (
    <div>
      <Card style={cardStyleSolid}>
        <CardContent>
          <Typography variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="subtitle2" component="div" color="#9B9CA8">
            {lastUpdated}
          </Typography>
          <Typography variant="subtitle2" component="div" color="#9B9CA8">
            ({nodeCount}) Nodes
          </Typography>
        </CardContent>
        <CardActions>
          <div style={cardActionsStyle}>
            <Button size="small" onClick={onView}>View</Button>
            <Button size="small" onClick={onDelete}>Delete</Button>
          </div>
        </CardActions>
      </Card>
    </div>
  )
}