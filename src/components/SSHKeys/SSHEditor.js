import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {firestore} from '../../FirebaseSetup';
import { doc, setDoc } from '@firebase/firestore';

export default function SSHEditor(props) {
  const {email} = props;
  const [name, setName] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [key, setKey] = React.useState(false);

  const handleNameChange = (event) => {
    setName(event.target.value);
  }

  const handleKeyChange = (event) =>{
    setKey(event.target.value);
  }

  const handleSave = async () => {
    setIsSaving(true);
    const docRef = doc(firestore, "ssh-keys", email, "keys", name);
    const newDoc = {
      name: name,
      key: key,
    }
    await setDoc(docRef, newDoc);
    setIsSaving(false);
  }

  const moveRight = {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
  };
  return (
    <div style={{ maxWidth: "600px" }}>
      <form className='creds-form' noValidate autoComplete="off">
        <div>
          <TextField
            id="name"
            helperText="name"
            fullWidth
            margin="normal"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <div>
        <textarea rows="7" cols="71" onChange={handleKeyChange} />
        </div>
      </form>
      <div style={moveRight}>
        <Button
          id='save-new-ssh-key'
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={isSaving}>
          {isSaving ? 'Saving' : 'Save New Key'}
        </Button>
      </div>
    </div>
  )
}
