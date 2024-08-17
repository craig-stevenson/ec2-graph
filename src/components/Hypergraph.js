import React, { useState, useEffect } from 'react';
import { fetchAllNodes } from '../models/ec2';
import Canvas from './canvas';
import './Hypergraph.css';
import GraphSettings from './Graph/GraphSettings';
import RingLoader from "react-spinners/RingLoader";
import { Graph } from '../models/Graph/Graph';
import { billing } from '../models/billing';
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from '../FirebaseSetup';

function Hypergraph(props) {
  const [loading, setLoading] = useState(true);

  const fetchNodes = async () => {
    console.log("fetchNodes()");
    Graph.drawAwsNode();

    const promises = [
      Graph.fetchNewData("us-east-1"),
      Graph.fetchNewData("us-east-2"),
      Graph.fetchNewData("us-west-1"),
    ];
    const results = await Promise.all(promises);
    //window.allNodes.set("us-east-1", results[0]);
    //window.allNodes.set("us-west-1", results[1]);
    setLoading(false);
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  if (loading) {
    return (
      <div style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "center", }}>
          <h1>Fetching your AWS data</h1>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <RingLoader loading={true} color={"#ff8c00"} size={200} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div>
        <div className="hypergraph">
          <Canvas functions={props.functions} email={props.email}></Canvas>
        </div>
      </div>
      <GraphSettings />
    </div>
  );
}

export default Hypergraph;