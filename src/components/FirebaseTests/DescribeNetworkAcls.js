import React, { useEffect } from 'react';
import ReactJson from 'react-json-view';
import { NetworkAcl } from '../../models/ec2/NetworkAcl';

export default function DescribeNetworkAcls(props) {
  const [data, setData] = React.useState(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log("DescribeNetworkAcls()");
      const result = await NetworkAcl.fetchData("us-east-1");
      setData(result);
    };
    fetchData();
  }, []);

  if (!data) return null;

  return (
    <ReactJson src={data} />
  )
}
