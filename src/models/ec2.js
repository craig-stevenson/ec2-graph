import { Vpc } from './ec2/Vpc';
import { RouteTable } from './ec2/RouteTable';
import { InternetGateway } from './ec2/InternetGateway';
import { NetworkAcl } from './ec2/NetworkAcl';
import { Subnet } from './ec2/Subnet';
import { Instance } from './ec2/Instance';
import { SecurityGroup } from './ec2/SecurityGroup';

import { NODE_STYLE } from './constants';





async function fetchSubnetsAsNodes(region) {
  const data = await Subnet.fetchAll(region);
  const nodes = data.map(e => Subnet.createNode(e));
  return nodes;
};

async function fetchInstancesAsNodes(region) {
  const data = await Instance.fetchAll(region);
  const nodes = data.map(e => Instance.createNode(e));
  return nodes;
}

async function fetchSecurityGroupsAsNodes(region) {
  const data = await SecurityGroup.fetchAll(region);
  const nodes = data.map(e => SecurityGroup.createNode(e));
  return nodes;
}

//takes the json from aws describing a security group
function createRuleNodes(securityGroup) {
  const nodes = [];
  for (const rule of securityGroup.IpPermissions) {
    const label = [];
    label.push("Inbound Rule");
    label.push(`Allow ${rule.IpProtocol}`);
    label.push(`from port ${rule.FromPort}`);
    label.push(`to port ${rule.ToPort}`);
    for (const ipRange of rule.IpRanges) {
      label.push(ipRange.CidrIp);
    }
    const node = {
      resource: "Inbound Rule",
      info: rule,
      label: label.join("\n"),
      shape: 'box',
      ...NODE_STYLE,
    }
    nodes.push(node);
  }

  for (const rule of securityGroup.IpPermissionsEgress) {
    const label = [];
    label.push("Outbound Rule");
    if (rule.IpProtocol === "-1") {
      label.push(`Allow All Protocols`);
    } else {
      label.push(`Allow ${rule.IpProtocol}`);
    }

    if (rule.FromPort) {
      label.push(`from port ${rule.FromPort}`);
    } else {
      label.push("from all ports");
    }

    if (rule.ToPort) {
      label.push(`to port ${rule.ToPort}`);
    } else {
      label.push("to all ports");
    }

    for (const ipRange of rule.IpRanges) {
      label.push(ipRange.CidrIp);
    }

    const node = {
      resource: "Outbound Rule",
      info: rule,
      label: label.join("\n"),
      shape: 'box',
      ...NODE_STYLE,
    }
    nodes.push(node);
  }
  return nodes;
}

async function fetchInternetGatewaysAsNodes(region) {
  const data = await InternetGateway.fetchAll(region);
  const nodes = data.map(e => InternetGateway.createNode(e));
  return nodes;
}

async function fetchSecurityGroupRules(firebaseFunctions, id) {
  const describeSecurityGroupRules = firebaseFunctions.httpsCallable('getSecurityGroupRules');
  const response = await describeSecurityGroupRules({ id: id });
  return response;
}

async function fetchRouteTablesAsNodes(region) {
  console.log(`fetchRouteTablesAsNodes(), region=${region}`);
  const data = await RouteTable.fetchAll(region);
  const nodes = data.map(e => RouteTable.createNode(e));
  return nodes;
}

async function fetchNetworkAclsAsNodes(region) {
  const data = await NetworkAcl.fetchAll(region);
  const nodes = data.map(e => NetworkAcl.createNode(e));
  return nodes;
}

async function fetchAllNodes(region) {
  console.log(`fetchAllNodes(), region=${region}`);
  if (!region) return null;

  const arrayOfPromises = [
    Vpc.fetchData(region),
    // fetchRouteTablesAsNodes(region),
    // fetchInternetGatewaysAsNodes(region),
    // fetchSubnetsAsNodes(region),
    // fetchSecurityGroupsAsNodes(region),
    // fetchInstancesAsNodes(region),
    // fetchNetworkAclsAsNodes(region)
  ];

  const allPromises = await Promise.all(arrayOfPromises);
  // allPromises[1].forEach((n) => {nodes.routeTables.set(n.id, n)});
  // allPromises[2].forEach((n) => {nodes.internetGateways.set(n.id, n)});
  // allPromises[3].forEach((n) => {nodes.subnets.set(n.id, n)});
  // allPromises[4].forEach((n) => {nodes.securityGroups.set(n.id, n)});
  // allPromises[5].forEach((n) => {nodes.instances.set(n.id, n)});
  // allPromises[6].forEach((n) => {nodes.networkAcls.set(n.id, n)});
}

function createFirewallNode() {
  const node = {
    resource: "Security Groups",
    label: "Security Groups",
    ...NODE_STYLE,
    image: "firewall-square.png",
    shape: "circularImage",
  }
  return node;
}
export {
  fetchAllNodes,
  createRuleNodes,
  createFirewallNode,
};