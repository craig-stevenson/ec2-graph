import { NODE_STYLE } from "../constants";
import { NetworkAcl } from "../ec2/NetworkAcl";

const NODES = new Map();
const NODES_BY_ID = new Map();
const NODES_BY_VPC = new Map();

function createNode(json) {
  const label = [];
  label.push("Network ACL");
  if (json.IsDefault) label.push("DEFAULT");

  const node = {
    id: json.NetworkAclId,
    resource: "Network ACL",
    info: json,
    label: label.join("\n"),
    ...NODE_STYLE,
  }
  return node;
}

const fetchNewData = async (region)=>{
  await NetworkAcl.fetchData(region);
  const nodes = [];
  for (const acl of NetworkAcl.getData(region)){
    const node = createNode(acl);
    node.region = region;
    nodes.push(node);
    NODES_BY_ID.set(node.id, node);
    NODES_BY_VPC.set(node.info.VpcId, node);
  }
  NODES.set(region, nodes);
}

const getNodes = (region) => {
  if (!NODES.has(region)) return [];
  return NODES.get(region);
}

const getNodeById = (id) => {
  if (!NODES_BY_ID.has(id)) return null;
  return NODES_BY_ID.get(id);
}

const getNodeByVpc = (id)=>{
  if (!NODES_BY_VPC.has(id)) return null;
  return NODES_BY_VPC.get(id);
}

const getUpdate = (vpcId)=>{
  const node = getNodeByVpc(vpcId);
  const update = {
    node: node,
    edge: {
      id: `${vpcId}_${node.id}`,
      from: vpcId,
      to: node.id,
    }
  };
  return update;
};

const NetworkAclNodes = {
  fetchNewData: fetchNewData,
  getNodes: getNodes,
  getNodeById: getNodeById,
  getNodeByVpc: getNodeByVpc,
  getUpdate: getUpdate,
};


export { NetworkAclNodes }