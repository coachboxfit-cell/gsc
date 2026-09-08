require("dotenv").config();
const https = require("https");
const fs = require("fs");

const ca = fs.existsSync("/root/.ccr/ca-bundle.crt")
  ? fs.readFileSync("/root/.ccr/ca-bundle.crt")
  : undefined;

const options = {
  hostname: "api.airtable.com",
  path: "/v0/meta/bases",
  headers: { Authorization: `Bearer ${process.env.AIRTABLE_PAT}` },
  ca,
};

https.get(options, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => console.log(JSON.stringify(JSON.parse(data), null, 2)));
}).on("error", console.error);
