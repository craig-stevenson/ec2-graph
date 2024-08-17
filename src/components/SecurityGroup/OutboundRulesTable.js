import React from 'react'
import Paper from '@material-ui/core/Paper';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import Button from '@material-ui/core/Button';

export default function OutboundRulesTable(props) {
  const { ipPermissionsEgress } = props;


  const Rule = (props) => {
    const { permission } = props;
    const ipRanges = permission.IpRanges.map(i => i.CidrIp);

    return (
      <TableRow>
        <TableCell>{permission.IpProtocol === "-1" ? "All" : permission.IpProtocol}</TableCell>
        <TableCell>{permission.FromPort ? permission.FromPort : "All"}</TableCell>
        <TableCell>{permission.ToPort ? permission.ToPort : "All"}</TableCell>
        <TableCell>{ipRanges.join(", ")}</TableCell>
      </TableRow>
    );
  }

  const rows = [];
  var i = 0;
  for (const permission of ipPermissionsEgress) {
    rows.push(<Rule key={i} permission={permission} />);
    i++;
  }

  const tableTitleStyle = {
    marginLeft: "16px",
  };

  return (
    <div style={{ display: "flex", paddingBottom: "8px", width: "100%" }}>
      <Paper elevation={3} style={{width: "100%"}}>
        <div style={tableTitleStyle}>
          <h3>Outbound Rules</h3>
        </div>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Protocol</TableCell>
              <TableCell>From Port</TableCell>
              <TableCell>To Port</TableCell>
              <TableCell>Ip Range</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
      </Paper>
    </div>
  )
}
