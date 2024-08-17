import { DataSet } from 'vis-network/standalone';

import { NODE_STYLE } from '../constants';
import { VpcNodes } from './VpcNodes';
import { RouteTableNodes } from './RouteTableNodes';
import { InstanceNodes } from './InstanceNodes';
import { SubnetNodes } from './SubnetNodes';
import { NetworkAclNodes } from './NetworkAclNodes';
import { SecurityGroupNodes } from './SecurityGroupNodes';
import { InternetGatewayNodes } from './InternetGatewayNodes';
import { KeyboardReturn } from '@material-ui/icons';
import { InternetGateway } from '../ec2/InternetGateway';

const NODES = new DataSet();
const EDGES = new DataSet();
const UPDATE_QUEUE = [];


function createFirewallNode() {
  const node = {
    resource: "Security Groups",
    label: "Security Groups",
    showSecurityGroups: false,
    ...NODE_STYLE,
    image: "firewall-square.png",
    shape: "circularImage",
  }
  return node;
}

const processUpdates = () => {
  const update = UPDATE_QUEUE.shift();
  if (!update){
    const event = new Event('update queue is empty');
    window.dispatchEvent(event);
    return;
  }

  const parentXY = window.visNetwork.getPosition(update.edge.from);
  update.node.x = parentXY.x;
  update.node.y = parentXY.y;
  EDGES.update(update.edge);
  NODES.update(update.node);
  if (UPDATE_QUEUE.length === 0) {
    const event = new Event('update queue is empty');
    window.dispatchEvent(event);
    return;
  }

  setTimeout(processUpdates, 500);
}

function createAwsNode() {
  const node = {
    'id': 'AWS-node',
    'label': 'AWS',
    'color': '#FF9900',
    'shape': 'box',
    x: 0,
    y: 0,
    fixed: true,
    font: {
      color: 'white',
      size: 48,
    },
  };

  return node;
}

const drawAwsNode = () => {
  const node = createAwsNode();
  NODES.update(node);
}

function createRegionNode(region) {
  const node = {
    id: region,
    resource: "Region",
    region: region,
    label: ["REGION", region].join("\n"),
    ...NODE_STYLE,
  }
  return node;
}

const updateRegion = (region) => {
  const node = createRegionNode(region);
  const edge = {
    id: `${region}_${node.id}`,
    from: 'AWS-node',
    to: node.id,
  }
  NODES.update(node);
  EDGES.update(edge);
  return node;
}

const deleteRegion = (region) => {
  const nodes = [];
  NODES.forEach((e) => {
    if (!e.region) return;
    if (e.region === region) {
      nodes.push(e.id);
    }
  });
  NODES.remove(nodes);
  return nodes;
}

const Regions = {
  delete: deleteRegion,
  create: createRegionNode,
  update: updateRegion,
};

const instanceView = (region) => {
  updateRegion(region);
  const vpcUpdates = new Set();
  const routeTableUpdates = new Set();
  const subnetUpdates = new Set();
  const networkAclUpdates = new Set();

  const instanceNodes = InstanceNodes.getNodes(region);
  for (const instanceNode of instanceNodes) {
    if (instanceNode.state === "terminated") continue;
    const subnetId = instanceNode.info.SubnetId;
    const vpcId = instanceNode.info.VpcId;

    //handle the Vpc
    if (!vpcUpdates.has(vpcId)) {
      const update = VpcNodes.getUpdate(vpcId, region);
      UPDATE_QUEUE.push(update);
      vpcUpdates.add(vpcId);

      const igwNode = InternetGatewayNodes.getNodeByVpc(vpcId);
      if(igwNode){
        const igwId = igwNode.info.InternetGatewayId;
        const igwUpdate = InternetGatewayNodes.getUpdate(igwId, vpcId);
        UPDATE_QUEUE.push(igwUpdate);
      }
    }

    //handle the NetworkAcl
    const aclUpdate = NetworkAclNodes.getUpdate(vpcId);
    if (!networkAclUpdates.has(aclUpdate.node.id)) {
      UPDATE_QUEUE.push(aclUpdate);
      networkAclUpdates.add(aclUpdate.node.id);
    }

    //handle the RouteTable
    let routeTableNode = RouteTableNodes.getNodeBySubnet(subnetId);
    if (!routeTableNode) { routeTableNode = RouteTableNodes.getNodeByVpc(vpcId); }
    if (!routeTableUpdates.has(routeTableNode.id)) {
      const routeTableUpdate = {
        node: routeTableNode,
        edge: {
          id: `${vpcId}_${routeTableNode.id}`,
          from: vpcId,
          to: routeTableNode.id,
        },
      };
      UPDATE_QUEUE.push(routeTableUpdate);
      routeTableUpdates.add(routeTableNode.id);
    }

    //handle Subnets
    let subnetNode = SubnetNodes.getNodeById(subnetId);
    if (!subnetUpdates.has(subnetNode.id)) {
      const subnetUpdate = {
        node: subnetNode,
        edge: {
          id: `${routeTableNode.id}_${subnetNode.id}`,
          from: routeTableNode.id,
          to: subnetNode.id,
        }
      }
      UPDATE_QUEUE.push(subnetUpdate);
      subnetUpdates.add(subnetNode.id);
    }

    //handle the Security Groups
    const firewall = createFirewallNode();
    firewall.id = `firewall_${instanceNode.id}`;
    firewall.region = region;
    firewall.securityGroups = instanceNode.SecurityGroups;
    const firewallUpdate = {
      node: firewall,
      edge: {
        id: `${subnetId}_${firewall.id}`,
        from: subnetId,
        to: firewall.id
      }
    }
    UPDATE_QUEUE.push(firewallUpdate);

    //handle the Instance
    const instanceUpdate = {
      node: instanceNode,
      edge: {
        id: `${firewall.id}_${instanceNode.id}`,
        from: firewall.id,
        to: instanceNode.id,
      }
    }
    UPDATE_QUEUE.push(instanceUpdate);
  }

  processUpdates();
}


const fetchNewData = async (region) => {
  const promises = [
    VpcNodes.fetchNewData(region),
    NetworkAclNodes.fetchNewData(region),
    RouteTableNodes.fetchNewData(region),
    SubnetNodes.fetchNewData(region),
    InstanceNodes.fetchNewData(region),
    SecurityGroupNodes.fetchNewData(region),
    InternetGatewayNodes.fetchNewData(region),
  ];

  await Promise.all(promises);
}

const updateSecurityGroup = (id, parentId) => {
  const node = SecurityGroupNodes.getNodeById(id);
  if(!node) return;
  const newNode = {...node};
  newNode.id = `${parentId}_${id}`;
  NODES.update(newNode);
  EDGES.update({id:newNode.id, from: parentId, to: `${parentId}_${id}` });
}

const Graph = {
  fetchNewData: fetchNewData,
  drawAwsNode: drawAwsNode,
  instanceView: instanceView,
  Regions: Regions,
  nodes: NODES,
  edges: EDGES,
  updates: UPDATE_QUEUE,
  updateSecurityGroup: updateSecurityGroup,
};

window.Graph = Graph;

export { Graph }
