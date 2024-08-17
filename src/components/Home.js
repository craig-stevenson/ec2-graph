import React, { useState, useEffect } from 'react';
import Hypergraph from './Hypergraph';

import './ListOfCreds.css';
function Home(props) {
  return (
    <div>
      <Hypergraph email={props.email}></Hypergraph>
    </div>
  )
}

export default Home;