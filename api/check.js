import express from "express";
const app = express();
import { readFileSync } from "fs";
import process from "process";

process.on('SIGTERM', () => {
  console.info("Interrupted")
  process.exit(0)
})

import { google } from "googleapis";
const playintegrity = google.playintegrity("v1");

const packageName = process.env.PACKAGE_NAME;
const privatekey = JSON.parse(
  readFileSync("/data/credentials.json", { encoding: "utf-8" })
);

async function getTokenResponse(token) {
  let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ["https://www.googleapis.com/auth/playintegrity"]
  );

  google.options({ auth: jwtClient });

  const res = await playintegrity.v1.decodeIntegrityToken({
    packageName: packageName,
    requestBody: {
      integrityToken: token,
    },
  });

  console.log(res.data.tokenPayloadExternal);

  return res.data.tokenPayloadExternal;
}

app.get("/api/check", async (req, res) => {
  const { token = "none" } = req.query;

  if (token == "none") {
    res.status(400).send({ error: "No token provided" });
    return;
  }

  getTokenResponse(token)
    .then((data) => {
      res.status(200).send(data);
      return;
    })
    .catch((e) => {
      console.log(e);
      res.status(200).send({ error: "Google API error.\n" + e.message });
      return;
    });
});

app.listen(3000, () => {
  console.log("Check API listening on port 3000");
});
