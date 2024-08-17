import React, { useEffect } from 'react';
import ReactJson from 'react-json-view';
import { Subnet } from '../../models/ec2/Subnet';

export default function GetSubnetData() {
    const [data, setData] = React.useState(null);

    const fetchData = async () => {
        console.log("GetSubnetData()");
        const result = await Subnet.fetchData('us-east-1');
        setData({data: Subnet.getData('us-east-1')});
    };

    useEffect(() => fetchData(), []);

    if (!data) return null;

    return (
        <ReactJson src={data} displayDataTypes={false} />
    )
}
