import { NODE_STYLE } from "../constants";
import { Instance } from "../ec2/Instance";

const NODES = new Map();

function createNode(json) {
  const node = {
    id: json.InstanceId,
    resource: "Virtual Machine",
    privateIpAddress: json.PrivateIpAddress || "None",
    publicIpAddress: json.PublicIpAddress ?? "None",
    info: json,
    SubnetId: json.SubnetId,
    VpcId: json.VpcId,
    SecurityGroups: [],
    margin: { top: 8, bottom: 8, left: 8, right: 8 },
    shape: "box",
    state: json.State.Name,
    ...NODE_STYLE,
  }

  if(node.state === 'running'){
    node.shadow = {
      enabled: true,
      color: '#00FF00',
      size: 8,
      x: 0,
      y: 0,
    };
  }

  for (const tag of json.Tags) {
    if (tag.Key === "Name") {
      node.name = tag.Value;
      break;
    }
  }
  const label = ["VM"];
  if (node.name) label.push(node.name);
  label.push(`privateIP: ${node.privateIpAddress}`);
  label.push(`publicIP: ${node.publicIpAddress}`);
  label.push(node.state);
  node.label = label.join("\n");
  for (const securityGroup of json.SecurityGroups) {
    node.SecurityGroups.push(securityGroup.GroupId);
  }
  return node;
}

const getNodes = (region) => {
  if (!NODES.has(region)) return [];
  return NODES.get(region);
}

const fetchNewData = async (region) => {
  await Instance.fetchData(region);
  const nodes = [];
  for (const vpc of Instance.getData(region)) {
    const node = createNode(vpc);
    node.region = region;
    nodes.push(node);
  }
  NODES.set(region, nodes);
}

const InstanceNodes = {
  createNode: createNode,
  fetchNewData: fetchNewData,
  getNodes: getNodes,
};

window.InstanceNodes = InstanceNodes;

export { InstanceNodes }