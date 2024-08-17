import { httpsCallable } from "firebase/functions";
import { functions, firestore as db } from "../../FirebaseSetup";
import { doc, setDoc } from "firebase/firestore";

const fetchAcls = httpsCallable(functions, 'describeNetworkAcls');
const DATA = new Map();

const fetchData = async (region) => {
  console.log(`NetworkAcl.fetchData(${region})`);
  var response;
  response = await fetchAcls({ region: region });
  const arrayOfAcls = response.data.NetworkAcls;
  arrayOfAcls.forEach(acl => { 
    acl.region = region;
    const email = window.user.email;
    if (email) {
      const docRef = doc(db, email, "AWS", "NetworkAcls", acl.NetworkAclId);
      setDoc(docRef, acl);
    }
  });
  DATA.set(region, arrayOfAcls);
  return response;
}

const getData = (region) => {
  if (!DATA.has(region)) return [];
  return DATA.get(region)
};

const NetworkAcl = {
  fetchData: fetchData,
  getData: getData,
}

window.NetworkAcl = NetworkAcl;

export { NetworkAcl }
