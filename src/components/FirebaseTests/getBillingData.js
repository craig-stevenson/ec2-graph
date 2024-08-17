import React, { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import { billing } from '../../models/billing';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore, } from '../../FirebaseSetup';
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc, onSnapshot } from "firebase/firestore";


export default function GetBillingData(props) {
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log(`email=${props.email}`);
    const docRef = doc(firestore, "billing", props.email);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      console.log('onDocChange');
      setData(doc.data());
    });
  }, []);


  if (!data) {
    return <h1>loading data</h1>
  }

  return (
    <ReactJson src={data} />
  )
}
