import * as admin from 'firebase-admin';
import fs from "fs";

// will need this setup to run on gcloud engine
// https://firebase.google.com/docs/admin/setup#set-scopes-for-realtime-database-auth
try {
  const serviceAccount = JSON.parse(fs.readFileSync("credentials.json", "utf8")).firebaseServiceAccount;

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://trade-assistant-fa3f0.firebaseio.com",
  });
} catch (error) {
  // if credential doesn't exist, assume app is running on remote server
  // if app is running on remote server it will have credentials
  admin.initializeApp();
}

console.log(admin.app().name);

export default admin;
