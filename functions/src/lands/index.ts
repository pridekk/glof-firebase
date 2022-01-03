import * as express from "express";
import * as cors from "cors";
import {getOwnersInTiles, getTiles, LandOwner, updateOwners} from "./utils";



export const app = express();

app.use(cors({origin: true}));

// eslint-disable-next-line max-len
const TOKEN = "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjcxMTQzNzFiMmU4NmY4MGM1YzYxNThmNDUzYzk0NTEyNmZlNzM5Y2MiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZ2V0bGFuZG9uZm9vdCIsImF1ZCI6ImdldGxhbmRvbmZvb3QiLCJhdXRoX3RpbWUiOjE2NDA2NDM4MjksInVzZXJfaWQiOiJFN0pxRE5CY0dPZllld3V2SjJKdTh1b2hQa3AyIiwic3ViIjoiRTdKcUROQmNHT2ZZZXd1dkoySnU4dW9oUGtwMiIsImlhdCI6MTY0MDY0MzgyOSwiZXhwIjoxNjQwNjQ3NDI5LCJlbWFpbCI6InByaWRla2tAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInByaWRla2tAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.gx_y1ihqrzEChCdnUGOdXkD981pPHyx3pY8HnL7joJT1wiIczLKUVKX8L8U5FYWw_JT4ZTAWdoi91KW7TTO_hp3xAXkKgwnmUZ7Vkdfaw-3tLh03eoTtLR0DmBkf9-qTdUczvWs2-Fd6WBhOdNGWx551Dttbd6iQP3ArLZ4svS3dJyToSIm40RwhhcYT_knAawoJbmIJzsAQb0M_HNsfXc1l4xNyN7Ou5UZ4b3g3qKr-b20Q3Tn3LjZ7UXcfZA5MPVIsywCRhQs-GYATQrszlTmvF1INhPrfU3yNjTNWEXFJWsKfFn0F4km9_tAx6Kr6gPgGNsfCRLMlB0lQjUjMGQ"

app.get("/owners",
    async (req, res) => {
    // Grab the text parameter.
      const south = Number(req.query.south);
      const west = Number(req.query.west);
      const east = Number(req.query.east);
      const north = Number(req.query.north);
      // Push the new message into Firestore using the Firebase Admin SDK.

      const data = await getTiles(south, west, north, east);

      let owners = [];

      console.log(req.headers);
      if (req.headers.authorization == null) {
        owners = await getOwnersInTiles(TOKEN, data[0], data[1]);
      }
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
      res.json({result: owners});
    });

app.post("/owner", async (req, res) => {
  const data: [LandOwner] = req.body.owners;

  await updateOwners(data);

  res.json({result: data});
});


