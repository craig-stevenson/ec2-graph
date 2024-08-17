import React, {useEffect} from 'react'
import ReactJson from 'react-json-view';
import { NatGateway } from '../../models/ec2/NatGateways';

export default function GetNatGateways(props) {
    const [data, setData] = React.useState(null);

    const fetchData = async ()=>{
        console.log("GetNatGateways()");
        const result = await NatGateway.fetchAll('us-east-1');
        setData(result);
    };

    useEffect(()=>fetchData(), []);

    if(!data){
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
