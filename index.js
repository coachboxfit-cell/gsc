require("dotenv").config();
const Airtable = require("airtable");

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(
  process.env.AIRTABLE_BASE_ID
);

async function fetchRecords() {
  const records = [];
  await base(process.env.AIRTABLE_TABLE_ID)
    .select({ view: "viwAF5l5CfMJb4L4z" })
    .eachPage((pageRecords, fetchNextPage) => {
      for (const record of pageRecords) {
        records.push({ id: record.id, ...record.fields });
      }
      fetchNextPage();
    });

  console.log(`Fetched ${records.length} records:\n`);
  for (const record of records) {
    console.log(JSON.stringify(record, null, 2));
    console.log("---");
  }
}

fetchRecords().catch(console.error);
