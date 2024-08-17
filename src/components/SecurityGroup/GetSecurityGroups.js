import React, { useEffect } from 'react';
import ReactJson from 'react-json-view';
import ReactLoading from "react-loading";
import { SecurityGroup } from '../../models/ec2/SecurityGroup';


export default function GetSecurityGroups(props) {
  const [data, setData] = React.useState(null);

  const fetchData = async () => {
    const result = await SecurityGroup.fetchData("us-east-1");
    setData({data: SecurityGroup.getData("us-east-1")});
  };

  useEffect(() => fetchData(), []);

  if (!data) {
    return (
      <div>
        <h1>Loading</h1>
        <ReactLoading type="spin" color="black" width="20%" height="20%" />
      </div>

    )
  }

  return (
    <ReactJson src={data} />
  )
}
