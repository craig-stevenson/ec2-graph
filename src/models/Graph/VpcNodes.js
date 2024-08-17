import { NODE_STYLE } from "../constants";
import { Vpc } from "../ec2/Vpc";

const NODES = new Map();
const NODES_BY_ID = new Map();

function createNode(json) {
  const label = [];
  if(json.IsDefault){
    label.push("VPC-default");
  }else{
    label.push("VPC");
  }
  label.push(json.VpcId);
  label.push(json.CidrBlock);
  const node = {
    id: json.VpcId,
    resource: "Virtual Private Cloud",
    info: json,
    region: json.region,
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
  await Vpc.fetchData(region);
  const nodes = [];
  for (const vpc of Vpc.getData(region)) {
    const node = createNode(vpc);
    nodes.push(node);
    NODES_BY_ID.set(node.info.VpcId, node);
  }
  NODES.set(region, nodes);

}

const getNodeById = (id) => {
  if (!NODES_BY_ID.has(id)) return null;
  return NODES_BY_ID.get(id);
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

const VpcNodes = {
  fetchNewData: fetchNewData,
  getNodes: getNodes,
  getNodeById: getNodeById,
  getUpdate: getUpdate,
}

export { VpcNodes }