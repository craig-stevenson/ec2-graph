import { httpsCallable } from "firebase/functions";
import { functions, firestore as db } from "../../FirebaseSetup";
import { doc, setDoc } from "firebase/firestore"; 

const fetchInstances = httpsCallable(functions, 'getEc2Data');
const DATA = new Map();

const fetchData = async (region) => {
    console.log(`Instance.fetchData(${region})`);
    var response;
    try {
        response = await fetchInstances({ region: region });
    } catch (error) {
        console.error(error);
        return [];
    }
    const arrayOfInstances = [];
    for (const reservation of response.data.Reservations) {
        for (const i of reservation.Instances) {
            i.region = region;
            arrayOfInstances.push(i);
            const email = window.user.email;
            if (email){
                const docRef = doc(db, email, "AWS", "Instances", i.InstanceId);
                setDoc(docRef, i);
            }
        }
    }
    DATA.set(region, arrayOfInstances);

    return arrayOfInstances;
}

const getData = (region) => {
    if (!DATA.has(region)) return [];
    return DATA.get(region)
};

const Instance = {
    fetchData: fetchData,
    getData: getData,
};

window.Instance = Instance;

export { Instance }