import React, { useEffect } from 'react'
import { FormControlLabel } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import { Graph } from '../../models/Graph/Graph';


export default function RegionSwitch(props) {
  const [show, setShow] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const { region } = props;

  const handleEmptyQueue = (event) => {
    console.log('handleEmptyQueue()');
    setDisabled(false);
  }

  useEffect(() => {
    window.addEventListener('update queue is empty', handleEmptyQueue);

    //clean up this component
    return () => { window.removeEventListener('update queue is empty', handleEmptyQueue) };
  }, []);

  const handleShow = (event) => {
    if (event.target.checked === true) {
      setShow(true);
      setDisabled(true);
      Graph.instanceView(region);
      return;
    }

    if (event.target.checked === false) {
      setShow(false);
      setDisabled(true);
      Graph.Regions.delete(region);
      setDisabled(false);
    }
  }

  return (
    <FormControlLabel
      control={
        <Switch
          disabled={disabled}
          checked={show}
          onChange={handleShow}
          name="HandlePhysics"
          color="primary" />
      }
      label={`Show ${region} `}
    />
  )
}
