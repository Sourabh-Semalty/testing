import config from "./config/config";
import { sqlQuery } from "./config/mysqlConn";
import bqExecute from "cc-gapi-lite/lib/bigquery/query";
import {
  checkFileExists,
  getAllContacts,
  readFilesWithSubstring,
  writeEmailToFile,
} from "./common_fn";

async function getOfflineEvents(domainId: string, campaignId: string) {
  const bsql = `
    SELECT channelId as emailId 
    FROM ${config.bqProject}.ccart.offline_events_${domainId}
    WHERE domainId = '${domainId}'
    AND campaignId = '${campaignId}'  
    AND campaignType = 'manual'
    AND event = 'emailSent' 
  `;
  const { rows, columns } = await bqExecute(config.bqProject, bsql);
  const colNames = columns.map((col: any) => col.name);
  const filteredResult = rows.map((row: any) => {
    const t: any = {};
    colNames.map((cname: any, colIndex: any) => {
      t[cname] = row[colIndex];
    });
    return t;
  });
  return filteredResult;
}

async function performOperation(domainId: string, campaignId: string) {
  const fileName = `${domainId}_campaigns_${campaignId}`;
  const data = await readFilesWithSubstring(fileName);
  const contacts = await getAllContacts(data);
  console.log(contacts);
}

function findSecondLowestAndGreatest(arr) {
  // Sort the array in ascending order
  arr.sort(function (a, b) {
    return a - b;
  });

  // Return the second lowest and second greatest numbers
  return [arr[1], arr[arr.length - 2]];
}

// check if any argument has been passed related to domainId:
if (process.argv.length > 0) {
  let domainId: string = "";
  let campaignId: string = "";
  process.argv.forEach(function (val, index) {
    if (val.includes("domain")) {
      const values = val.split("=");
      if (!values[1])
        return console.log(
          "domain is empty kindly provide a domain_id to start the script "
        );
      domainId = values[1];
    }
  });
  process.argv.forEach(function (val, index) {
    if (val.includes("campaign")) {
      const values = val.split("=");
      if (!values[1])
        return console.log(
          "domain is empty kindly provide a domain_id to start the script "
        );
      campaignId = values[1];
    }
  });

  // read the data from bqOffline events
  console.log(
    `Reading the domain data from ccart-beta.ccart.offline_events_${domainId}`
  );

  performOperation(domainId, campaignId);
}
