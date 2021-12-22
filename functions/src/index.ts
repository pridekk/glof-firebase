// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
import {https} from "firebase-functions";
import {app} from "./lands";

exports.lands = https.onRequest(app);

