import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import { Button } from "@material-ui/core";
import { Divider } from "@material-ui/core";
import JsonPaper from "../JsonPaper";
import { addDoc, collection } from '@firebase/firestore';
import {firestore as db} from '../../FirebaseSetup';
import { Graph } from '../../models/Graph/Graph';

export default function Vpc(props) {
  const { CidrBlock, State, VpcId, Tags, IsDefault } = props.node.info;
  const email = props.email;

  let name = false;
  const findName = Tags.find((element) => element.Key === "Name");
  if (typeof findName !== "undefined") {
    name = findName.Value;
  }

  const fieldStyle = {
    fontWeight: "bold",
    color: "#333",
    width: "160px"
  };

  const rowStyle = {
    display: "flex",
    padding: "8px"
  };

  const paperStyle = {
    paddingLeft: "8px",
    paddingRight: "8px",
    width: "100%",
  };

  const saveTemplate = async ()=>{
    const today = new Date();
    const date = today.toDateString();
    window.visNetwork.storePositions();
    const docref = collection(db, email, "vpc-templates", "templates");
    const newData = {
      name: name || VpcId,
      nodes: Graph.nodes.get(),
      edges: Graph.edges.get(),
      lastUpdated: date,
    }
    await addDoc(docref, newData);
    
    console.log("addDoc=DONE");
  };

  return (
    <div>
      <div style={{ display: "flex", paddingBottom: "8px" }}>
        <Paper elevation={3} style={paperStyle}>
          <Button onClick={saveTemplate}>Save New Template</Button>
        </Paper>
      </div>
      <div style={{ display: "flex", paddingBottom: "8px" }}>
        <Paper elevation={3} style={paperStyle}>
          {name ? (
            <div>
              <div style={rowStyle}>
                <div style={fieldStyle}>Name:</div>
                <div>{name}</div>
              </div>
              <Divider />
            </div>
          ) : null}
        </Paper>
      </div>
      <div style={{ display: "flex", paddingBottom: "8px" }}>
        <Paper elevation={3} style={paperStyle}>
          <div style={rowStyle}>
            <div style={fieldStyle}>State:</div>
            <div>{State}</div>
          </div>
          <Divider />
          <div style={rowStyle}>
            <div style={fieldStyle}>Cidr Block:</div>
            <div>{CidrBlock}</div>
          </div>
          <Divider />
          <div style={rowStyle}>
            <div style={fieldStyle}>VPC ID:</div>
            <div>{VpcId}</div>
          </div>
          <Divider />
          <div style={rowStyle}>
            <div style={fieldStyle}>Is Default:</div>
            <div>{`${IsDefault}`}</div>
          </div>
        </Paper >
      </div>
      <div style={{ display: "flex", width:"100%"}}>
        <JsonPaper data={props.node.info}></JsonPaper>
      </div>
    </div >
  );

}
