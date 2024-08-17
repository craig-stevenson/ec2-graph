import { NODE_STYLE } from "../constants";
import { RouteTable } from "../ec2/RouteTable";

const NODES_BY_REGION = new Map();
const NODES_BY_ID = new Map();
const NODES_BY_SUBNET = new Map();
const NODES_BY_VPC = new Map();

function createNode(json) {
  if(!json.Associations){
    console.log('RouteTable.createNode(), json=');
    console.log(json);
    return;
  }
  const label = [];
  label.push("Route Table");
  for (const association of json.Associations) {
    if (association.Main) {
      label.push("MAIN");
      break;
    }
  }

  const node = {
    id: json.RouteTableId,
    resource: "Route Table",
    info: json,
    label: label.join("\n"),
    image: "amazon-vpc-router.png",
    ...NODE_STYLE,
    shape: "image",
  }

  return node;
}

const getNodes = (region) => {
  if (!NODES_BY_REGION.has(region)) return [];
  return NODES_BY_REGION.get(region);
}

const fetchNewData = async (region) => {
  await RouteTable.fetchData(region);
  const nodes = [];
  for (const table of RouteTable.getData(region)) {
    const node = createNode(table);
    node.region = region;
    nodes.push(node);
    NODES_BY_ID.set(node.info.VpcId, node);
    NODES_BY_VPC.set(node.info.VpcId, node);
    if(!node.info.Associations) continue;
    node.info.Associations.forEach((association)=>{
      if(!association.SubnetId) return;
      NODES_BY_SUBNET.set(association.SubnetId, node);
    });
  }
  NODES_BY_REGION.set(region, nodes);
}

const getNodeBySubnet = (subnetId)=>{
  if (!NODES_BY_SUBNET.has(subnetId)) return null;
  return NODES_BY_SUBNET.get(subnetId);
};

const getNodeByVpc = (id)=>{
  if (!NODES_BY_VPC.has(id)) return null;
  return NODES_BY_VPC.get(id);
};

const RouteTableNodes = {
  fetchNewData: fetchNewData,
  getNodes: getNodes,
  getNodeBySubnet: getNodeBySubnet,
  getNodeByVpc: getNodeByVpc,
}

export { RouteTableNodes };