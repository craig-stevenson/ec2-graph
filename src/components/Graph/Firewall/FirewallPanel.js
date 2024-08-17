import React, {useEffect} from 'react'
import Paper from "@material-ui/core/Paper";
import { FormControlLabel, FormGroup, TextField } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import JsonPaper from "../../JsonPaper";
import { Graph } from '../../../models/Graph/Graph';

export default function FirewallPanel(props) {
  const { node } = props;
  const [showSecurityGroups, setShowSecurityGroups] = React.useState(props.node.showSecurityGroups);
  
  // React.useEffect(()=>{
  //   const newNode = Graph.nodes.get(node.id);
  //   console.log("FirewallPanel.useEffect()");
  //   console.log(newNode);
  //   setShowSecurityGroups(newNode.setShowSecurityGroups);
  // },[]);

  const onClick = (event) => {
    if (event.target.checked === true) {
      for (const id of node.securityGroups) {
        Graph.updateSecurityGroup(id, node.id);
      }
      Graph.nodes.update({id: node.id, showSecurityGroups: true});
      setShowSecurityGroups(true);
      return;
    }

    if (event.target.checked === false) {
      for (const id of node.securityGroups) {
        Graph.nodes.remove(`${node.id}_${id}`);
      }
      Graph.nodes.update({id: node.id, showSecurityGroups: false});
      setShowSecurityGroups(false);
      return;
    }
  }

  return (
    <div>
      <div style={{ display: "flex", paddingBottom: "8px" }}>
        <Paper elevation={3}>
          <div style={{ padding: "8px", display: "flex" }}>
            <form noValidate autoComplete="off">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showSecurityGroups}
                      onChange={onClick}
                      name="ShowSecurityGroups"
                      color="primary" />
                  }
                  label="Show Security Groups"
                />
              </FormGroup>
            </form>
          </div>
        </Paper>
      </div>
      <div style={{ display: "flex", width:"100%"}}>
        <JsonPaper data={node}></JsonPaper>
      </div>
    </div>
  )
}
