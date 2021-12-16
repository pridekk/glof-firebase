// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
import {https} from "firebase-functions";
import {initializeApp, firestore} from "firebase-admin";
initializeApp();

const db = firestore();

exports.getOwner = https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const x = Number(req.query.x);
  const y = Number(req.query.y);
  // Push the new message into Firestore using the Firebase Admin SDK.

  const doc = await db.collection( "landOwners").doc(`${x},${y}`).get();

  let data = null;
  if (doc.exists) {
    data = doc.data();
    console.log("Document data:", data);
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
  // Send back a message that we've successfully written the message
  res.json({result: data});
});

