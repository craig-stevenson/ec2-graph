import { NODE_STYLE } from "../constants";
import { InternetGateway } from "../ec2/InternetGateway";

const NODES = new Map();
const NODES_BY_VPC = new Map();
const NODES_BY_ID = new Map();

function createNode(json) {
  const node = {
    id: json.InternetGatewayId,
    resource: "Internet Gateway",
    info: json,
    label: "Internet Gateway",
    image: "internet-gateway.png",
    ...NODE_STYLE,
    shape: "image",
  }
  return node;
}

const getNodes = (region) => {
  if (!NODES.has(region)) return [];
  return NODES.get(region);
}

const fetchNewData = async (region) => {
  await InternetGateway.fetchData(region);
  const nodes = [];
  for (const igw of InternetGateway.getData(region)){
    const node = createNode(igw);
    node.region = region;
    nodes.push(node);
    if(!node.info.Attachments) continue;
    node.info.Attachments.forEach((attachment)=>{
      if(!attachment.VpcId) return;
      NODES_BY_VPC.set(attachment.VpcId, node);
    });
    NODES_BY_ID.set(node.info.InternetGatewayId, node);
  }
  NODES.set(region, nodes);
}

const getUpdate = (id, parentId)=>{
  const update = {
    node: NODES_BY_ID.get(id),
    edge: {
      id: `${parentId}_${id}`,
      from: parentId,
      to: id
    }
  };
  return update;
};

const getNodeByVpc = (id)=>{
  if (!NODES_BY_VPC.has(id)) return null;
  return NODES_BY_VPC.get(id);
}; 

const InternetGatewayNodes = {
  createNode: createNode,
  fetchNewData: fetchNewData,
  getNodes: getNodes,
  getNodeByVpc: getNodeByVpc,
  getUpdate: getUpdate,
}

window.InternetGatewayNodes = InternetGatewayNodes;

export { InternetGatewayNodes }