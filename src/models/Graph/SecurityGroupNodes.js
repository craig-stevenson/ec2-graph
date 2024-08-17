import { NODE_STYLE } from "../constants";
import { SecurityGroup } from "../ec2/SecurityGroup";

const NODES = new Map();
const NODES_BY_ID = new Map();

function createNode(json) {
  const label = [];
  label.push("Security Group");
  label.push(json.GroupName);
  const node = {
    id: json.GroupId,
    resource: "Security Group",
    info: json,
    label: label.join("\n"),
    VpcId: json.VpcId,
    shape: 'box',
    ...NODE_STYLE,
  }
  return node;
}

const getNodes = (region) => {
  if (!NODES.has(region)) return [];
  return NODES.get(region);
}

const getNodeById = (id) => {
  if (!NODES_BY_ID.has(id)) return null;
  return NODES_BY_ID.get(id);
}

const fetchNewData = async (region) => {
  await SecurityGroup.fetchData(region);
  const nodes = [];
  for (const securityGroup of SecurityGroup.getData(region)) {
      const node = createNode(securityGroup);
      node.region = region;
      nodes.push(node);
      NODES_BY_ID.set(node.id, node);
  }
  NODES.set(region, nodes);
}

const SecurityGroupNodes = {
  fetchNewData: fetchNewData,
  getNodes: getNodes,
  getNodeById: getNodeById,
};

export { SecurityGroupNodes };