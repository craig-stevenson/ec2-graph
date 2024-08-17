import { httpsCallable } from "firebase/functions";
import { functions } from "../FirebaseSetup";

const verifyAccount = httpsCallable(functions, 'verifyAccount');
var DATA = {}

const fetchData = async () => {
    console.log(`Billing.fetchData()`);
    var response;
    try {
        response = await verifyAccount();
    } catch (error) {
        console.error(error);
        return [];
    }
    DATA = response.data;
    return response;
}

const getData = (region) => {
    return DATA;
};

const billing = {
    fetchData: fetchData,
    getData: getData,
};

window.billing = billing;

export { billing }