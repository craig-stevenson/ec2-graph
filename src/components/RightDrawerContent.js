import React, {useEffect} from 'react'
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { IconButton } from '@material-ui/core';
import VirtualMachinePanel from './VirtualMachine/VirtualMachinePanel';
import SecurityGroupPanel from './SecurityGroup/SecurityGroupPanel';
import RouteTablePanel from './RouteTable/RouteTablePanel';
import NetworkAclPanel from './NetworkAcl/NetworlAclPanel';
import Vpc from './Vpc/Vpc';
import JsonPaper from './JsonPaper';
import FirewallPanel from './Graph/Firewall/FirewallPanel';
import {Graph} from '../models/Graph/Graph';


export default function RightDrawerContent(props) {
  const { node, handleClose } = props;

  if (!node) return null;
  
  const DefaultPanel = (props) => {
    return (
      <div style={{ display: "flex", width: "100%" }}>
        <JsonPaper data={props.node} />
      </div>
    )
  }

  const getComponent = () => {
    if (node.resource === "Security Groups") {
      return <FirewallPanel node={node} />
    }

    if (node.resource === "Virtual Machine") {
      return <VirtualMachinePanel node={node} email={props.email}/>
    }

    if (node.resource === "Security Group") {
      return <SecurityGroupPanel node={node} />
    }

    if (node.resource === "Virtual Private Cloud") {
      return <Vpc node={node} email={props.email} />
    }

    if (node.resource === "Route Table") {
      return <RouteTablePanel node={node} />
    }

    if (node.resource === "Network ACL") {
      return <NetworkAclPanel node={node} />
    }

    return <DefaultPanel node={node}></DefaultPanel>
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", backgroundColor: "#3f51b5", marginBottom: "8px", paddingRight: "8px" }}>
        <IconButton disableRipple={true} onClick={handleClose} style={{ color: "white" }}>
          <ChevronRightIcon />
        </IconButton>
        <h2 style={{ display: "inline", color: "white" }}>{node.resource}</h2>
      </div>
      <div style={{ margin: "8px" }}>
        {getComponent()}
      </div>

    </div>
  )
}
