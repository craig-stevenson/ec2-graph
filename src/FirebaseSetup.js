import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

const defaultProject = initializeApp(firebaseConfig);
const auth = getAuth(defaultProject);
const firestore = getFirestore(defaultProject);
const functions = getFunctions(defaultProject);

export { auth, firestore, functions }