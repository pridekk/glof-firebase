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
  const zoom = Number(req.query.zoom);
  const scale = 1 << zoom;


  const point = project(x, y);

  const tileCoordinate = new PointType(
      Math.floor((point.x * scale) / TILE_SIZE),
      Math.floor((point.y * scale) / TILE_SIZE)
  );

  console.log(tileCoordinate);
  const doc = await db.collection( "landOwners")
      .doc(`${tileCoordinate.x},${tileCoordinate.y}`).get();
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


// const getTiles = (x: number, y: number) => console.log(x, y);
const TILE_SIZE = 256;

const project = (lat: number, lng: number) => {
  let siny = Math.sin((lat * Math.PI) / 180);

  // Truncating to 0.9999 effectively limits latitude to 89.189. This is
  // about a third of a tile past the edge of the world tile.
  siny = Math.min(Math.max(siny, -0.9999), 0.9999);

  // eslint-disable-next-line max-len
  return new PointType(TILE_SIZE * (0.5 + lng / 360), TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
};


// eslint-disable-next-line require-jsdoc
class PointType {
  x: number;
  y: number ;
  // eslint-disable-next-line require-jsdoc
  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }
}
