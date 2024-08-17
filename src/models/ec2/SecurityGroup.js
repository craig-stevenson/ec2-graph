import { httpsCallable } from "firebase/functions";
import { functions, firestore as db } from "../../FirebaseSetup";
import { doc, setDoc } from "firebase/firestore";

const fetchGroups = httpsCallable(functions, 'describeSecurityGroups');
const DATA = new Map();

const fetchData = async (region) => {
  console.log(`SecurityGroup.fetchData(${region})`);
  var response;
  try {
    response = await fetchGroups({ region: region });
  } catch (error) {
    console.error(error);
    return [];
  }
  const arrayOfGroups = response.data.SecurityGroups;
  for (const group of arrayOfGroups){
    group.region = region;
    const email = window.user.email;
    if (email) {
      const docRef = doc(db, email, "AWS", "SecurityGroups", group.GroupId);
      setDoc(docRef, group);
    }
  }
  DATA.set(region, arrayOfGroups);
  return  arrayOfGroups;
}

const getData = (region) => {
  if (!DATA.has(region)) return [];
  return DATA.get(region)
};

const SecurityGroup = {
  fetchData: fetchData,
  getData: getData,
};

window.SecurityGroup = SecurityGroup;

export { SecurityGroup }