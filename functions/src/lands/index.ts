import * as express from "express";
import * as cors from "cors";
import {getTiles, LandOwner, updateOwners} from "./utils";


// const db = firestore();

export const app = express();

app.use(cors({origin: true}));


app.get("/owners",
    async (req, res) => {
    // Grab the text parameter.
      const south = Number(req.query.south);
      const west = Number(req.query.west);
      const east = Number(req.query.east);
      const north = Number(req.query.north);
      // Push the new message into Firestore using the Firebase Admin SDK.

      const data = getTiles(south, west, north, east);

      // console.log(tileCoordinate);
      // const doc = await db.collection( "landOwners")
      //     .doc(`${tileCoordinate.x},${tileCoordinate.y}`).get();
      // let data = null;
      // if (doc.exists) {
      //   data = doc.data();
      //   console.log("Document data:", data);
      // } else {
      //   // doc.data() will be undefined in this case
      //   console.log("No such document!");
      // }
      // Send back a message that we've successfully written the message
      res.json({result: data});
    });

app.post("/owner", async (req, res) => {
  const data: [LandOwner] = req.body.owners;

  await updateOwners(data);

  res.json({result: data});
});


