import React, { useEffect } from 'react'
import InboundRulesTable from './InboundRulesTable';
import OutboundRulesTable from './OutboundRulesTable';
import JsonPaper from "../JsonPaper";


export default function SecurityGroupPanel(props) {
  const { node, } = props;
  const ipPermissionsIngress = node.info.IpPermissions;
  const ipPermissionsEgress = node.info.IpPermissionsEgress;

  return (
    <div>
      <div style={{ display: "flex"}}>
        <InboundRulesTable ipPermissionsIngress={ipPermissionsIngress} />
      </div>
      <OutboundRulesTable ipPermissionsEgress={ipPermissionsEgress} />
      <JsonPaper data={node} />
    </div>
  )
}


