import React, { useEffect } from 'react';
import { Network } from "vis-network/standalone";
import Drawer from '@material-ui/core/Drawer';
import "./canvas.css"
import './Hypergraph.css'
import RightDrawerContent from './RightDrawerContent';
import { Graph } from '../models/Graph/Graph';

import { CANVAS_OPTIONS } from './constants';

function Canvas(props) {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedNode, setSelectedNode] = React.useState(null);
  const handleOpen = () => { setIsDrawerOpen(true) };
  const handleClose = () => { setIsDrawerOpen(false) };

  const handleDoubleClick = (event) => {
    if (event.nodes.length === 0) return;

    const nodeId = event.nodes[0];
    const node = Graph.nodes.get(nodeId);
    if (!node) return;

    if (node.resource === "Security Groups") {
      if (node.showSecurityGroups === false) {
        for (const id of node.securityGroups) {
          Graph.updateSecurityGroup(id, node.id);
        }
        Graph.nodes.update({ id: node.id, showSecurityGroups: true });
      } else {
        for (const id of node.securityGroups) {
          Graph.nodes.remove(`${node.id}_${id}`);
        }
        Graph.nodes.update({ id: node.id, showSecurityGroups: false });
      }

      return;
    }

    setIsDrawerOpen(true);
    setSelectedNode(null);
    setSelectedNode(node);
  };

  const attachGraph = () => {
    const container = document.getElementById('network');
    const data = { nodes: Graph.nodes, edges: Graph.edges };
    const network = new Network(container, data, CANVAS_OPTIONS);
    window.visNetwork = network;
    network.on("doubleClick", handleDoubleClick);
  };

  useEffect(attachGraph, []);

  return (
    <div>
      <div id='network'></div>
      <Drawer anchor="right" open={isDrawerOpen}>
        <div className="right-drawer" >
          <RightDrawerContent
            node={selectedNode}
            handleClose={handleClose}
            email={props.email}
          />
        </div>
      </Drawer>
    </div>
  );
}

export default Canvas;