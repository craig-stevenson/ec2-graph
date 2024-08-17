import React, { useState, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { firestore } from '../FirebaseSetup';
import { query, collection, deleteDoc, onSnapshot, doc } from '@firebase/firestore';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import SSHEditor from './SSHKeys/SSHEditor';

function ListOfSshKeys(props) {
  const { email } = props;
  const [keys, setKeys] = useState([]);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchData = async () => {
    const keysRef = collection(firestore, "ssh-keys", email, "keys");
    const q = query(keysRef);
    const unsub = await onSnapshot(q, (snapshot) => {
      const newKeys = [];
      snapshot.forEach((doc) => {
        newKeys.push(doc);
        console.log(doc.data());
      });
      setKeys(newKeys);
    });
    return () => { unsub() };
  };

  useEffect(() => fetchData(), []);
  
  const createKeysTable = () => {
    const keysTable = [];
    let i = 0;
    for (const key of keys) {
      const deleteKey = () => {
        deleteDoc(key.ref);
      };
      const newRow = (
        <TableRow key={i}>
          <TableCell>{key.data().name}</TableCell>
          <TableCell>
            <IconButton onClick={deleteKey}><DeleteIcon fontSize="small" /></IconButton>
          </TableCell>
        </TableRow>
      );
      keysTable.push(newRow);
      i++;
    }
    return keysTable;
  }

  const fabStyle = {
    paddingTop: "8px",
    paddingLeft: "8px",
    paddingBottom: "8px"
  };

  const fabTextStyle = {
    display: "flex",
    alignItems: "center"
  }

  const tableStyle = {
    paddingTop: "8px",
    paddingLeft: "8px",
    maxWidth: "600px"
  }
  return (
    <div>
      <div style={fabStyle}>
        <Fab color="primary" variant="extended" onClick={handleOpen}><AddIcon /><div style={fabTextStyle}>Add New SSH-Key</div></Fab>
      </div>
      <div style={tableStyle}>
      <Paper elevation={3}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {createKeysTable()}
          </TableBody>
        </Table>
      </Paper>
      </div>
      <Dialog open={open} onClose={handleClose} maxWidth="lg">
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Add new SSH Key
        </DialogTitle>
        <SSHEditor email={email}></SSHEditor>
      </Dialog>
    </div>
  )
}

export default ListOfSshKeys;