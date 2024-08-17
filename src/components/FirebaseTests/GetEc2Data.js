import React, { useEffect } from 'react';
import ReactJson from 'react-json-view';
import { Instance } from '../../models/ec2/Instance';

export default function GetEc2Data(props) {
    const [data, setData] = React.useState(null);

    const fetchData = async ()=>{
        console.log("GetEc2Data()");
        const result = await Instance.fetchData('us-east-1');
        setData({data: Instance.getData('us-east-1')});
    };

    useEffect(()=>fetchData(), []);

    if(!data) return null;
    
    return (
        <ReactJson src={data} />
    )
}
