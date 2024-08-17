import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import { Divider } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ReactJson from "react-json-view";
import JsonPaper from "../JsonPaper";
import TableOfRoutes from "./TableOfRoutes";

const paperStyle = {
  paddingLeft: "8px",
  paddingRight: "8px",
  width: "100%",
};

const rowStyle = {
  display: "flex",
  padding: "8px"
};

const fieldStyle = {
  fontWeight: "bold",
  color: "#333",
  width: "160px"
};
export default function RouteTablePanel(props) {
  const { Tags, Routes, RouteTableId } = props.node.info;
  const [isJson, setIsJson] = useState(false);

  let name = false;
  const findName = Tags.find((element) => element.Key === "Name");
  if (typeof findName !== "undefined") {
    name = findName.Value;
  }

  function showJson() {
    isJson ? setIsJson(false) : setIsJson(true);
  }

  return (
    <div>
      <div style={{ display: "flex", paddingBottom: "8px" }}>
        <Paper elevation={3} style={paperStyle}>
          <div style={rowStyle}>
            <div style={fieldStyle}>Route Table Id:</div>
            <div>{RouteTableId}</div>
          </div>
        </Paper>
      </div>
      <div style={{ display: "flex", width: "100%" }}>
        <TableOfRoutes data={props.node.info} />
      </div>
      <div style={{ display: "flex", width: "100%" }}>
        <JsonPaper data={props.node.info} />
      </div>
    </div>
  )
}
