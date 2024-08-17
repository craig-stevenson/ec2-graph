import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {firestore} from '../FirebaseSetup';
import { query, collection, doc, getDoc, setDoc } from '@firebase/firestore';

import './ListOfCreds.css';

function ListOfCreds(props) {
  const { email } = props;
  const [isSaving, setIsSaving] = useState(false);
  const [keyId, setKeyId] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const fetchData = async () => {
    const docRef = doc(firestore, "keys", email);
    const docSnapshot = await getDoc(docRef);
    console.log("keys=");
    console.log(docSnapshot.data());
    setKeyId(docSnapshot.data().awsKeyId);
    setSecretKey(docSnapshot.data().awsSecretAccessKey);
  };

  useEffect(()=>fetchData(), []);

  const handleSave = async () => {
    setIsSaving(true);
    const docRef = doc(firestore, "keys", email);
    const newDoc = {
      awsKeyId: keyId,
      awsSecretAccessKey: secretKey,
    }
    await setDoc(docRef, newDoc);
    setIsSaving(false);
  }

  const handleKeyIdChange = (event)=>{
    setKeyId(event.target.value);
  }

  const handleSecretKeyChange = (event)=>{
    setSecretKey(event.target.value);
  }


  return (
    <div style={{maxWidth:"450px"}}>
      <form className='creds-form' noValidate autoComplete="off">
        <div>
          <TextField
            id="key-id"
            helperText="Aws Key Id"
            fullWidth
            margin="normal"
            value={keyId}
            onChange={handleKeyIdChange}
          />
        </div>
        <div>
          <TextField
            id="secret-access-key"
            helperText="Aws Secret Key"
            fullWidth
            margin="normal"
            value={secretKey}
            onChange={handleSecretKeyChange}
          />
        </div>
        <div>
          <Button
            id='save-button'
            className='save-button'
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={isSaving}>
            {isSaving ? 'Saving' : 'Save'}
          </Button>
        </div>
      </form>
    </div >
  )
}

export default ListOfCreds;