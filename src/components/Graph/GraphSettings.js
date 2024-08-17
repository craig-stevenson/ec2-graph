import React from 'react'

import { FormControlLabel, FormGroup, Paper, TextField } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import { CANVAS_OPTIONS } from '../constants';
import RegionSwitch from './RegionSwitch';
import { Graph } from '../../models/Graph/Graph';


export default function GraphSettings(props) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [showUsEast1, setShowUsEast1] = React.useState(false);
  const [physics, setPhysics] = React.useState(true);

  const handlePhysics = (event) => {
    setPhysics(event.target.checked);
    if (event.target.checked === false) {
      window.visNetwork.stopSimulation();
      window.visNetwork.setOptions({ physics: false });
      return;
    }

    if (event.target.checked === true) {
      window.visNetwork.setOptions({ physics: CANVAS_OPTIONS.physics });
    }
  };

  const handleChange = (e) => {
    const filterStr = e.target.value;
    Graph.nodes.forEach((node) => {
      if (node.label.includes(filterStr)) {
        Graph.nodes.update({ id: node.id, hidden: false });
      } else {
        Graph.nodes.update({ id: node.id, hidden: true });
      }
    });
    window.visNetwork.fit();
  };


  return (
    <div style={{ position: "absolute", top: "72px", left: "8px" }}>
      <Paper elevation={3}>
        <div style={{ padding: "8px", display: "flex" }}>
          <form noValidate autoComplete="off">
            <FormGroup>
              <TextField
                id="outlined-basic"
                variant="standard"
                size="small"
                style={{ marginLeft: "8px" }}
                onChange={handleChange}
                label="Filter All Nodes"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={physics}
                    onChange={handlePhysics}
                    name="HandlePhysics"
                    color="primary" />
                }
                label="Enable Physics"
              />
              <RegionSwitch region='us-east-1' />
              <RegionSwitch region='us-west-1' />
              <RegionSwitch region='us-east-2' />
            </FormGroup>
          </form>
        </div>
      </Paper>
    </div>
  )
}
