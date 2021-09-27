import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import {Dexcom} from "./dexcom";
import axios from "axios";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

admin.initializeApp();

export const api = functions.https.onRequest(async (request, response) => {
  return await app(request, response);
});

app.get( "/api/ping", async ( req, res ) => {
  res.end("PONG");
});

app.post( "/api/register", async ( req, res ) => {
  console.log(req.body);
  if (req.body == null || req.body.id == null) {
    res.sendStatus(400);
    res.end("invalid id");
    return;
  }

  try {
    const code = await Dexcom.register(req.body.id);
    res.end(code);
  } catch (_) {
    res.sendStatus(500);
    res.end();
  }
});

app.get( "/api/oauth2", async ( req, res ) => {
  const query: any = req.query;

  const params = new URLSearchParams();

  params.append("client_secret", functions.config().dexcom.client_secret);
  params.append("client_id", functions.config().dexcom.client_id);
  params.append("code", query.code);
  params.append("grant_type", "authorization_code");
  params.append("redirect_uri", functions.config().dexcom.redirect_uri);

  try {
    const data = await axios.post(`https://${functions.config().dexcom.host}/v2/oauth2/token`, params);
    await Dexcom.authenticate(query.state, {
      accessToken: data.data.access_token,
      refreshToken: data.data.refresh_token,
      expiresIn: data.data.expires_in,
    });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
    res.end("unable to get token");
    return;
  }

  res.end("Phone paired");
} );
