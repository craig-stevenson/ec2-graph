import { NODE_STYLE } from "../constants";
import { Subnet } from '../ec2/Subnet';

const NODES = new Map();
const NODES_BY_ID = new Map();

function createNode(json) {
  const label = [];
  if(json.DefaultForAz){
    label.push("Subnet-default");
  } else {
    label.push("Subnet");
  }
  
  label.push(json.SubnetId);
  label.push(json.AvailabilityZone);
  label.push(json.CidrBlock);
  const node = {
    id: json.SubnetId,
    resource: "Subnet",
    info: json,
    label: label.join("\n"),
    ...NODE_STYLE,
  }
  return node;
}

const getNodes = (region) => {
  if (!NODES.has(region)) return [];
  return NODES.get(region);
}

const fetchNewData = async (region) => {
  await Subnet.fetchData(region);
  const nodes = [];
  for (const subnet of Subnet.getData(region)) {
      const node = createNode(subnet);
      node.region = region;
      nodes.push(node);
      NODES_BY_ID.set(node.id, node);
  }
  NODES.set(region, nodes);
}

const getNodeById = (id) => {
  if (!NODES_BY_ID.has(id)) return null;
  return NODES_BY_ID.get(id);
}

const SubnetNodes = {
  fetchNewData: fetchNewData,
  getNodes: getNodes,
  getNodeById: getNodeById
};

export { SubnetNodes }