import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import './header.css';

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



function Header(props) {
  const classes = useStyles();

  return (
    <div >
      <AppBar className={classes.root} position="static">
        <Toolbar>
          <Button color="inherit" onClick={() => { window.location = "#/" }}>HyperCloud</Button>
          <Typography variant="h6" className={classes.title}></Typography>
          <Button color="inherit" onClick={() => { window.location = "#/vpc-templates" }}>vpc-templates</Button>
          <Button color="inherit" onClick={() => { window.location = "#/aws-keys" }}>AWS-Keys</Button>
          <Button color="inherit" onClick={() => { window.location = "#/ssh-keys" }}>SSH-Keys</Button>
          <Button color="inherit" onClick={() => props.auth.signOut()}>Logout</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
