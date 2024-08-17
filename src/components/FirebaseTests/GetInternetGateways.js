import React, { useEffect } from 'react';
import ReactJson from 'react-json-view';
import { InternetGateway } from '../../models/ec2/InternetGateway';

import ReactLoading from "react-loading";


export default function GetInternetGateways(props) {
  const [data, setData] = React.useState(null);

  const fetchData = async () => {
    console.log("getInternetGateways()");
    const result = await InternetGateway.fetchData('us-east-1');
    setData({ data: InternetGateway.getData("us-east-1") });
  };

  useEffect(() => fetchData(), []);

  if (!data) {
    return (
      <div>
        <h1>Loading</h1>
      </div>

    )
  }
  return (
    <ReactJson src={data} />
  )
}
