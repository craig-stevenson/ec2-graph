import React, { useState, useEffect } from 'react'
import { firestore as db } from '../../FirebaseSetup';
import { query, collection, onSnapshot, setDoc, addDoc } from '@firebase/firestore';
import DocumentTable from './DocumentTable';
import Canvas from './Canvas';

export default function VpcTemplates(props) {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const user = props.user;

  const fetchData = async () => {
    const ref = collection(db, user.email, "vpc-templates", "templates");
    const q = query(ref);
    const unsub = await onSnapshot(q, (snapshot) => {
      const newTemplates = [];
      snapshot.forEach((doc) => {
        newTemplates.push(doc);
      });
      setTemplates(newTemplates);
    });
    return unsub;
  };
  useEffect(() => fetchData(), []);

  if(selectedTemplate){
    return (
      <Canvas data={selectedTemplate.data()}></Canvas>
    );
  }

  return (
    <div>
      <DocumentTable docs={templates} onView={setSelectedTemplate} />
    </div>
  )
}
