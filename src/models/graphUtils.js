import { createFirewallNode } from "./ec2";

function updateGraphFromInstances(nodes, rootNode) {
  if(!nodes){
    console.log("nodes is empty");
    return;
  }
  const mapFromGatewayToRouter = new Map();
  const mapFromVpcToDefaultRouter = new Map();
  const mapFromSubnetToRouter = new Map();
  const mapFromVpcToNetworkACL = new Map();
  const mapFromSubnetToNetworkAcl = new Map();
  for (const node of nodes.routeTables.values()) {
    for (const association of node.info.Associations) {
      if (association.Main) {
        mapFromVpcToDefaultRouter.set(node.info.VpcId, node);
      }

      if (association.SubnetId) {
        mapFromSubnetToRouter.set(association.SubnetId, node);
      }
    }

    for (const route of node.info.Routes) {
      if (route.GatewayId === "local") continue;
      mapFromGatewayToRouter.set(route.GatewayId, node);
    }
  }

  for (const node of nodes.networkAcls.values()) {
    if (!mapFromVpcToNetworkACL.has(node.info.VpcId)) {
      mapFromVpcToNetworkACL.set(node.info.VpcId, []);
    }
    const aclArray = mapFromVpcToNetworkACL.get(node.info.VpcId);
    aclArray.push(node);
    for (const ass of node.info.Associations) {
      mapFromSubnetToNetworkAcl.set(ass.SubnetId, node);
    }
  }

  for (const instanceNode of nodes.instances.values()) {
    const vpc = nodes.vpc.get(instanceNode.info.VpcId);
    if (instanceNode.state === "terminated") continue;
    window.updateQueue.push({ node: vpc, edge: { id: `${rootNode.id}_${vpc.id}`, from: rootNode.id, to: vpc.id } });

    let router = mapFromVpcToDefaultRouter.get(vpc.id);
    if (mapFromSubnetToRouter.has(instanceNode.info.SubnetId)) {
      router = mapFromSubnetToRouter.get(instanceNode.info.SubnetId);
    }
    window.updateQueue.push({ node: router, edge: { id: `${vpc.id}_${router.id}`, from: vpc.id, to: router.id } });

    const subnet = nodes.subnets.get(instanceNode.info.SubnetId);
    window.updateQueue.push({ node: subnet, edge: { id: `${router.id}_${subnet.id}`, from: router.id, to: subnet.id } });

    const networkAcl = mapFromSubnetToNetworkAcl.get(subnet.id);
    if (networkAcl) {
      networkAcl.id = `${networkAcl.info.NetworkAclId}_${subnet.id}`;
      window.updateQueue.push({node: networkAcl, edge:{ id: networkAcl.id, from: subnet.id, to: networkAcl.id }});
      
    }

    const firewall = createFirewallNode();
    firewall.id = `firewall_${instanceNode.id}`;
    firewall.region = rootNode.id;
    firewall.securityGroups = [];
    for(const securityGroup of instanceNode.info.SecurityGroups){
      firewall.securityGroups.push(nodes.securityGroups.get(securityGroup.GroupId));
    }

    const edgeFromSubetToFirewall = {id:`${subnet.id}_${firewall.id}`, from:subnet.id, to: firewall.id};
    window.updateQueue.push({node: firewall, edge: edgeFromSubetToFirewall});

    window.updateQueue.push({node: instanceNode, edge:{ id: `${firewall.id}_${instanceNode.id}`, from: firewall.id, to: instanceNode.id }});
  }

  for (const node of nodes.internetGateways.values()) {
    if (mapFromGatewayToRouter.has(node.id)) {
      const router = mapFromGatewayToRouter.get(node.id);
      window.updateQueue.push({
        node: node,
        edge: { id: `${router.id}_${node.id}`, from: router.id, to: node.id },
      });
    }
  }

  const processUpdates = () => {
    console.log("processUpdates()");
    console.log(`window.updateQueue.length=${window.updateQueue.length}`)

    if (window.updateQueue.length === 0) return;

    const update = window.updateQueue.shift();
    const parentXY = window.visNetwork.getPosition(update.edge.from);
    console.log(`parentXY={x:${parentXY.x}, y:${parentXY.y}}`);
    update.node.x = parentXY.x;
    update.node.y = parentXY.y;
    window.nodes.update(update.node);
    window.edges.update(update.edge);
    if(window.updateQueue.length === 0){
      const event = new Event('update queue is empty');
      window.dispatchEvent(event);
      return;
    }

    setTimeout(processUpdates, 1000);
  }

  processUpdates();
}

export { updateGraphFromInstances }