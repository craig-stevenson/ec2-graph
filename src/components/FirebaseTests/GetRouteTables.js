import React, { useEffect } from 'react'
import { RouteTable } from '../../models/ec2/RouteTable';
import ReactJson from 'react-json-view';

export default function GetRouteTables(props) {
  const [data, setData] = React.useState(null);

  const fetchData = async () => {
    const result = await RouteTable.fetchData("us-east-1");
    setData({data: RouteTable.getData("us-east-1")});
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
    <div> <ReactJson src={data} displayDataTypes={false} /></div>
  )
}
