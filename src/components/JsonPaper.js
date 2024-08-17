import React, { useState } from 'react'
import Paper from "@material-ui/core/Paper";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ReactJson from "react-json-view";
import { Divider } from "@material-ui/core";


const paperStyle = {
  paddingLeft: "8px",
  paddingRight: "8px",
  width: "100%",
};

const rowStyle = {
  display: "flex",
  padding: "8px",
};

const fieldStyle = {
  display: "flex",
  fontWeight: "bold",
  color: "#333",
  width: "160px",
  alignItems: "center",
};

export default function JsonPaper(props) {
  const [isJson, setIsJson] = useState(false);

  function showJson() {
    isJson ? setIsJson(false) : setIsJson(true);
  }
  return (
    <div style={{width:"100%"}}>
      <Paper elevation={3}>
        <div style={rowStyle} onClick={showJson}>
          <div style={fieldStyle}>All Json:</div>
          {isJson ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </div>
        {
          isJson ? (
            <div>
              <Divider />
              <div style={rowStyle}>
                <ReactJson src={props.data} enableClipboard={false} />
              </div>
            </div>
          ) : null
        }
      </Paper>
    </div>
  )
}
