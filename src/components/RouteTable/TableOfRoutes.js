import React from 'react'
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

export default function TableOfRoutes(props) {
  const routes = props.data.Routes;

  const RouteRow = (props) => {
    const { DestinationCidrBlock, GatewayId } = props.data;

    return (
      <TableRow>
        <TableCell>{DestinationCidrBlock}</TableCell>
        <TableCell>{GatewayId}</TableCell>
      </TableRow>
    );
  }

  const rows = [];
  var i = 0;
  for (const route of routes) {
    rows.push(<RouteRow key={i} data={route} />);
    i++;
  }

  const tableTitleStyle = {
    marginLeft: "16px",
  };

  return (
    <div style={{ width: "100%", display: "flex", paddingBottom: "8px" }}>
      <Paper elevation={3} style={{width: "100%"}}>
        <div style={tableTitleStyle}>
          <h3>Routes</h3>
        </div>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Destination</strong></TableCell>
              <TableCell><strong>GatewayId</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
      </Paper>
    </div>
  )
}
