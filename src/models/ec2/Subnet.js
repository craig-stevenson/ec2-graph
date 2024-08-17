import { httpsCallable } from "firebase/functions";
import { functions, firestore as db } from "../../FirebaseSetup";
import { doc, setDoc } from "firebase/firestore";

const fetchSubnets = httpsCallable(functions, 'getSubnetData');
const DATA = new Map();

const fetchData = async (region) => {
  console.log(`Subnet.fetchData(${region})`);
  var response;
  try {
    response = await fetchSubnets({ region: region });
  } catch (error) {
    console.error(error);
    return [];
  }
  const arrayOfSubnets = response.data.Subnets;
  arrayOfSubnets.forEach(i => { 
    i.region = region;
    const email = window.user.email;
    if (email) {
      const docRef = doc(db, email, "AWS", "Subnets", i.SubnetId);
      setDoc(docRef, i);
    }
  });
  DATA.set(region, arrayOfSubnets);
  return arrayOfSubnets;
}

const getData = (region) => {
  if (!DATA.has(region)) return [];
  return DATA.get(region)
};

const Subnet = {
  fetchData: fetchData,
  getData: getData,
};

window.Subnet = Subnet;

export { Subnet }