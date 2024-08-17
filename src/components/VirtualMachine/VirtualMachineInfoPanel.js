import React from 'react'
import Paper from '@material-ui/core/Paper';
import { Divider, FormHelperText } from '@material-ui/core';


export default function VirtualMachineInfoPanel(props) {
  const { node } = props;
  const fieldStyle = {
    fontWeight: "bold",
    color: "#333",
    width: "160px",
  };

  const rowStyle = {
    display: "flex",
    padding: "8px"
  };

  const paperStyle = {
    paddingLeft: "8px",
    paddingRight: "8px",
    width: "100%"
  }
  return (
    <div style={{ display: "flex", paddingBottom: "8px"}}>
      <Paper elevation={3} style={paperStyle}>
        <div style={rowStyle}>
          <div style={fieldStyle}>Name:</div>
          <div >{node.name}</div>
        </div>
        <Divider />
        <div style={rowStyle}>
          <div style={fieldStyle}>State:</div>
          <div>{node.state}</div>
        </div>
        <Divider />
        <div style={rowStyle}>
          <div style={fieldStyle}>Private Ip Address:</div>
          <div>{node.privateIpAddress}</div>
        </div>
        <Divider />
        <div style={rowStyle}>
          <div style={fieldStyle}>Public Ip Address:</div>
          <div>{node.publicIpAddress}</div>
        </div>
      </Paper>
    </div>
  )
}
