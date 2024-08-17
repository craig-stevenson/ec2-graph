import { httpsCallable } from "firebase/functions";
import { functions, firestore as db } from "../../FirebaseSetup";
import { NODE_STYLE } from "../constants";
import { doc, setDoc } from "firebase/firestore";

const fetchRouteTables = httpsCallable(functions, 'getRouteTables');
const DATA = new Map();
const NODES = new Map();

function createNode(json) {
  if(!json.Associations){
    console.log('RouteTable.createNode(), json=');
    console.log(json);
    return;
  }
  const label = [];
  label.push("Route Table");
  for (const association of json.Associations) {
    if (association.Main) {
      label.push("MAIN");
      break;
    }
  }

  const node = {
    id: json.RouteTableId,
    resource: "Route Table",
    info: json,
    label: label.join("\n"),
    image: "amazon-vpc-router.png",
    ...NODE_STYLE,
    shape: "image",
  }

  return node;
}

const fetchData = async (region) => {
  console.log(`RouteTable.fetchData(${region})`);
  var response;
  try {
    response = await fetchRouteTables({ region: region });
    console.log(response);
  } catch (error) {
    console.error(error);
    return [];
  }
  const arrayOfRouteTables = response.data.RouteTables;
  arrayOfRouteTables.forEach(table => { 
    table.region = region;
    const email = window.user.email;
    if (email) {
      const docRef = doc(db, email, "AWS", "RouteTables", table.RouteTableId);
      setDoc(docRef, table);
    }
  });
  DATA.set(region, arrayOfRouteTables);
  return arrayOfRouteTables;
}

const getData = (region)=>{
  if(!DATA.has(region)) return [];
  return DATA.get(region)
}

const RouteTable = {
  fetchData: fetchData,
  getData: getData,
}

window.RouteTable = RouteTable;

export { RouteTable }
