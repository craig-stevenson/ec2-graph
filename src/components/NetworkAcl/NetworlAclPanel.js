import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { WbIridescentTwoTone } from '@material-ui/icons';

const paperStyle = {
  paddingLeft: "8px",
  paddingRight: "8px",
  width: "100%",
};

export default function NetworklAclPanel(props) {
  const entries = props.node.info.Entries;
  const [isJson, setIsJson] = useState(false);

  function showJson() {
    isJson ? setIsJson(false) : setIsJson(true);
  }

  const Row = (entry) => {
    return (
      <TableRow key={entry.RuleNumber}>
        <TableCell>{entry.RuleNumber}</TableCell>
        <TableCell>{entry.CidrBlock}</TableCell>
        <TableCell>{entry.RuleAction}</TableCell>
        <TableCell>{entry.Egress?'Outbound':'Inbound'}</TableCell>
      </TableRow>
    );
  }

  const createRows = () => {
    entries.sort((a, b) => {
      if(a.RuleNumber > b.RuleNumber) return 1;
      if(a.RuleNumber < b.RuleNumber) return -1;
      return 0;
    });
    const rows = [];
    for (const e of entries) {
      const row = Row(e);
      rows.push(row);
    }
    return rows;
  }

  return (
    <div style={{ display: "flex", paddingBottom: "8px", width: "100%" }}>
      <Paper elevation={3} style={{ width: "100%" }}>
        <div style={{ marginLeft: "16px" }} >
          <h3>Rules</h3>
        </div>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Rule Number</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Inbound / Outbound</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{createRows()}</TableBody>
        </Table>
      </Paper>
    </div>
  )
}
