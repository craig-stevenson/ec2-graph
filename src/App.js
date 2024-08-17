import React, { useEffect, useState } from 'react';
import './App.css';
import * as FullStory from '@fullstory/browser';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, functions, firestore } from './FirebaseSetup';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import Header from './components/header';

import { Route, HashRouter, Switch } from 'react-router-dom';

import ListOfCreds from './components/ListOfCreds';
import ListOfSshKeys from './components/ListOfSshKeys';
import Home from './components/Home';
import GetVpcData from './components/FirebaseTests/GetVpcData';
import GetSubnetData from './components/FirebaseTests/GetSubnetData';
import GetEc2Data from './components/FirebaseTests/GetEc2Data';
import GetSecurityGroups from './components/SecurityGroup/GetSecurityGroups';
import GetInternetGateways from './components/FirebaseTests/GetInternetGateways';
import GetNatGateways from './components/FirebaseTests/GetNatGateways';
import GetRouteTables from './components/FirebaseTests/GetRouteTables';
import GetRegions from './components/FirebaseTests/GetRegions';
import DescribeNetworkAcls from './components/FirebaseTests/DescribeNetworkAcls';
import { Button } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import GetBillingData from './components/FirebaseTests/getBillingData';
import SocketIo from './components/SocketIo';
import VpcTemplates from './components/VpcTemplates/VpcTemplates';

FullStory.init({ orgId: '15XA3N' });

//to be filled with objects that look like {node: node, edge: edge}
window.updateQueue = [];

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
}));

function App() {
  const [user] = useAuthState(auth);
  const [billing, setBilling] = useState(null);
  const classes = useStyles();

  const SignIn = () => {
    const signInWithGoogle = () => {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider);
    }
    return (
      <Button onClick={signInWithGoogle}>
        <img src="google-button.png" alt="Login" />
      </Button>
    )
  }

  const fetchBilling = async () => {
    if (!user) return;
    const docRef = doc(firestore, "billing", user.email);
    const unsub = await onSnapshot(docRef, (doc) => {
      setBilling(doc.data());
      console.log("doc.data()=");
      console.log(doc.data());
    });
    return () => { unsub() };
  };

  useEffect(() => fetchBilling(), [user]);

  if (!user) {
    return (
      <div className="App">
        <AppBar className={classes.root} position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>Hypercloud</Typography>
          </Toolbar>
        </AppBar>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <SignIn />
        </div>
      </div>
    );
  }

  if (!billing) {
    return (
      <div className="App">
        <AppBar className={classes.root} position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>Hypercloud</Typography>
          </Toolbar>
        </AppBar>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h1>No Billing info Exists</h1>
        </div>
      </div>
    );
  }

  

  FullStory.setUserVars({ "email": user.email });
  window.user = user;
  return (
    <HashRouter>
      <div className="App">
        <Header auth={auth} />
        <Switch>
          <Route exact path="/">
            <Home email={user.email}></Home>
          </Route>
          <Route exact path="/creds">
            <ListOfCreds user={user} firestore={firestore} />
          </Route>
          <Route exact path="/vpc"><GetVpcData /></Route>
          <Route exact path="/networkacls"><DescribeNetworkAcls /></Route>
          <Route exact path="/routetables"><GetRouteTables /></Route>
          <Route exact path="/internetgateways"><GetInternetGateways /></Route>
          <Route exact path="/subnets"><GetSubnetData /></Route>
          <Route exact path="/securitygroups"><GetSecurityGroups /></Route>
          <Route exact path="/instances"><GetEc2Data /></Route>
          <Route exact path="/getnatgateways"><GetNatGateways /></Route>
          <Route exact path="/getregions">
            <GetRegions functions={functions}></GetRegions>
          </Route>
          <Route exact path="/billing"><GetBillingData email={user.email} /></Route>
          <Route path="/ssh"><SocketIo email={user.email} /></Route>
          <Route exact path="/aws-keys">
            <ListOfCreds firestore={firestore} email={user.email}></ListOfCreds>
          </Route>
          <Route exact path="/ssh-keys">
            <ListOfSshKeys firestore={firestore} email={user.email}></ListOfSshKeys>
          </Route>
          <Route exact path="/vpc-templates"><VpcTemplates user={user}/></Route>
        </Switch>
      </div>
    </HashRouter>
  );
}



export default App;