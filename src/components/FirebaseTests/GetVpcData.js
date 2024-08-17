import React, { useEffect } from 'react';
import ReactJson from 'react-json-view';
import {Vpc} from '../../models/ec2/Vpc';


export default function GetVpcData(props) {
    const [data, setData] = React.useState(null);

    const fetchData = async ()=>{
        console.log("GetVpcData()");
        const result = await Vpc.fetchData('us-east-1');
        setData({data: Vpc.getData('us-east-1')});
    };

    useEffect(()=>fetchData(), []);

    if(!data) return null;
    
    return (
        <ReactJson src={data} displayDataTypes={false} />
    )
}
