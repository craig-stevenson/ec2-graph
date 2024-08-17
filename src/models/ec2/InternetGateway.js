import { httpsCallable } from "firebase/functions";
import { functions, firestore as db } from "../../FirebaseSetup";
import { doc, setDoc } from "firebase/firestore";

const fetchInternetGateways = httpsCallable(functions, 'getInternetGateways');
const DATA = new Map();

const fetchData = async (region) => {
  console.log(`InternetGateway.fetchData(${region})`);
  var response;
  try {
    response = await fetchInternetGateways({ region: region });

  } catch (error) {
    return [];
  }
  const arrayOfInternetGateways = response.data.InternetGateways;
  arrayOfInternetGateways.forEach(i => { 
    i.region = region; 
    const email = window.user.email;
    if (email) {
      const docRef = doc(db, email, "AWS", "InternetGateways", i.InternetGatewayId);
      setDoc(docRef, i);
    }
  });
  DATA.set(region, arrayOfInternetGateways);
  
  return arrayOfInternetGateways;
}

const getData = (region)=>{
  if(!DATA.has(region)) return [];
  return DATA.get(region)
};

const InternetGateway = {
  fetchData: fetchData,
  getData: getData,
};

export { InternetGateway }