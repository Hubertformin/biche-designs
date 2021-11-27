import * as admin from "firebase-admin";

const serviceAccount = require("./@data/keys.json");
try {
    admin.initializeApp( {
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://biche-designs.firebaseio.com"
    }, 'Admin-instance');
} catch (e) {
    // console.log(e);
}

const fireAdmin = admin;
export default fireAdmin;