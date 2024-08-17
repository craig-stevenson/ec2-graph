import { DataSet } from 'vis-network/standalone';
import { v4 } from 'uuid';

const NODES = new DataSet();
const EDGES = new DataSet();


const CanvasModel = {
    nodes: NODES,
    edges: EDGES,
};

window.CanvasModel = CanvasModel;

export { CanvasModel }