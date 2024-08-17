import React, { useEffect } from 'react';
import { Network } from "vis-network/standalone";
import { CanvasModel } from './CanvasModel';
import { CANVAS_OPTIONS } from './constants';

function Canvas(props) {
  const data = props.data;

  const attachGraph = () => {
    CanvasModel.nodes.clear();
    CanvasModel.edges.clear();
    const container = document.getElementById('network');
    const graphModel = { nodes: CanvasModel.nodes, edges: CanvasModel.edges };
    const network = new Network(container, graphModel, CANVAS_OPTIONS);
    window.visNetwork = network;
    if(data.nodes) CanvasModel.nodes.update(data.nodes);
    if(data.edges) CanvasModel.edges.update(data.edges);
    const cleanup = ()=>{
      CanvasModel.nodes.clear();
      CanvasModel.edges.clear();
    };
    return cleanup;
  };

  useEffect(attachGraph, []);

  return (
    <div>
      <div id='network' style={{backgroundColor: "#d3d3d3"}}></div>
    </div>
  );
}

export default Canvas;