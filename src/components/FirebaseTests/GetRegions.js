import React, { useEffect } from 'react';
import ReactJson from 'react-json-view';


export default function GetRegions(props) {
    const [data, setData] = React.useState(null);

    const fetchData = async ()=>{
        console.log("describeRegions()");
        const func = props.functions.httpsCallable('describeRegions');
        const result = await func();
        setData(result);
    };

    useEffect(()=>fetchData(), []);

    if(!data) return null;
    
    return (
        <div>{JSON.stringify(data)}</div>
    )
}
