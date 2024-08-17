import React, { useEffect } from 'react';
import VirtualMachineInfoPanel from './VirtualMachineInfoPanel';
import JsonPaper from "../JsonPaper";
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import SocketIo from '../SocketIo';
import Draggable from 'react-draggable';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import { mapFromAmiToUsername } from '../../models/ec2/constants';
import { firestore } from '../../FirebaseSetup';
import { onSnapshot, doc } from '@firebase/firestore';


export default function VirtualMachinePanel(props) {
  const { node, email } = props;
  const [open, setOpen] = React.useState(false);
  const [sshKey, setSshKey] = React.useState('');
  const username = mapFromAmiToUsername.has(node.info.ImageId) ? mapFromAmiToUsername.get(node.info.ImageId) : "ec2-user";

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const modalStyle = {
    width: '960px',
    height: '600px',
    padding: '2px',
    border: '1px solid black',
    backgroundColor: 'white',
  };

  const fetchDoc = async () => {
    const docRef = doc(firestore, "ssh-keys", email, "keys", node.info.KeyName);
    const unsub = await onSnapshot(docRef, (snapshot) => {
      const data = snapshot.data();
      if (!data) {
        setSshKey('');
        return;
      }

      if (!data.key) {
        setSshKey('');
        return;
      }

      setSshKey(data.key);
    });
    return () => { unsub() };
  };

  useEffect(() => fetchDoc(), []);

  function PaperComponent(props) {
    return (
      <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
        <Paper {...props} />
      </Draggable>
    );
  }


  return (
    <div>
      {sshKey ?
        <div><Button onClick={handleOpen} variant="contained" color="primary">SSH</Button></div> :
        <div><Button onClick={handleOpen} variant="contained" disabled>SSH</Button></div>
      }

      <div style={{ display: "flex", width: "100%" }}>
        <VirtualMachineInfoPanel node={node} />
      </div>
      <JsonPaper data={node} />
      <Dialog open={open} onClose={handleClose} maxWidth="lg" PaperComponent={PaperComponent}>
        <Draggable>
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            SSH CONSOLE
          </DialogTitle>
        </Draggable>
        <SocketIo
          username={username}
          host={node.publicIpAddress}
          port="22"
          keyName={node.info.KeyName}
          sshKey={sshKey}
        />
      </Dialog>


    </div>
  )
}
