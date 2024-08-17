import React, { useState, useEffect } from 'react';
import DocumentCard from './DocumentCard';
import Grid from '@mui/material/Grid';
import { deleteDoc } from 'firebase/firestore';

const gridContainerStyle = {
  marginLeft: '16px',
  marginRight: '16px',
  marginTop: '16px'
}

export default function DocumentTable(props) {
  const docs = props.docs;
  const onView = props.onView;

  const createGridItems = () => {
    const items = [];
    for (const myDoc of docs) {
      const data = myDoc.data();
      const onViewTemplate = () => { onView(myDoc) };
      const onDelete = () => { deleteDoc(myDoc.ref) };
      const newGridItem = (
        <Grid key={myDoc.id} item>
          <DocumentCard
            name={data.name}
            lastUpdated={"Last update on "+data.lastUpdated}
            onView={onViewTemplate}
            onDelete={onDelete}
            nodeCount={data.nodes.length}
          />
        </Grid>
      );
      items.push(newGridItem);
    }
    return items;
  }

  return (
    <div style={gridContainerStyle}>
      <h2>My Documents</h2>
      <Grid container direction="row" spacing={2}>
        {createGridItems()}
      </Grid>
    </div>
  )
}