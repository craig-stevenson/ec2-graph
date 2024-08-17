import { httpsCallable } from "firebase/functions";
import { functions, firestore as db } from "../../FirebaseSetup";
import { doc, setDoc } from "firebase/firestore";

const fetchVpc = httpsCallable(functions, 'getVpcData');
const DATA = new Map();

const fetchData = async (region) => {
  console.log(`Vpc.fetchData(${region})`);
  var response;
  try {
    response = await fetchVpc({ region: region });

  } catch (error) {
    return [];
  }
  const arrayOfVpcs = response.data.Vpcs;
  for (const vpc of arrayOfVpcs) {
    vpc.region = region;
    const email = window.user.email;
    if (email) {
      const docRef = doc(db, email, "AWS", "Vpcs", vpc.VpcId);
      setDoc(docRef, vpc);
    }
  }
  DATA.set(region, arrayOfVpcs);


  return arrayOfVpcs;
}

const getData = (region) => {
  if (!DATA.has(region)) return [];
  return DATA.get(region)
};

const Vpc = {
  fetchData: fetchData,
  getData: getData,
};

window.Vpc = Vpc;

export { Vpc }