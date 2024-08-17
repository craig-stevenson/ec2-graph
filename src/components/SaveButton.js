import React, { useState } from 'react';
import Button from '@material-ui/core/Button';


function SaveButton(props) {
  const [busy, setBusy] = useState(props.busy);

  if (busy) {
    return (
      <Button className={props.className} variant="contained" color="primary" disabled>Saving</Button>
    )
  }

  return (
    <Button className={props.className} variant="contained" color="primary" onClick={props.onClick}>Save</Button>
  )
}

export default SaveButton;