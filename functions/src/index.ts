import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

admin.initializeApp();

// https://sugarwatch.solidarity.software => sw.api
// update watches with new egv
export const api = functions.https.onRequest(async (request, response) => {
  return await app(request, response);
});


// registers watch
app.post( "/ping", async ( req, res ) => {
  res.end("PONG");
});
