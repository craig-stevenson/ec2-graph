import { httpsCallable } from "firebase/functions";
import { functions, firestore as db } from "../../FirebaseSetup";
import { doc, setDoc } from "firebase/firestore";


const fetchData = httpsCallable(functions, 'getNatGateways');

const fetchAll = async (region) => {
  var response;
  try {
    response = await fetchData({ region: region });
  } catch (error) {
    console.error(error);
    return [];
  }
  const arrayOfNatGateways = response.data.message.NatGateways;
  arrayOfNatGateways.forEach(i => {
    i.region = region;
    const email = window.user.email;
    if (email) {
      const docRef = doc(db, email, "AWS", "NatGateways", i.NatGatewayId);
      setDoc(docRef, i);
    }
  });
  return
}

const NatGateway = {
  fetchAll: fetchAll,
};

export { NatGateway }