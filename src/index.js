const AWS = require('aws-sdk');

const attr = require('dynamodb-data-types').AttributeValue;
const fs = require('fs');
// Set the region and API versions globally
const region = process.argv[4]; // TODO -> validate if it is a valid region on AWS
AWS.config.update({ region });
AWS.config.apiVersions = {
  dynamodb: '2012-08-10'
}

// retrieve file Path for JSON file
let jsonPath = process.argv[2]; // TODO -> validate of the path name with .json exist or Not
const pathName = `${jsonPath}.json`;
let rawData = fs.readFileSync(pathName);
let jsonData = JSON.parse(rawData);
// Create DynamoDB service object
const ddb = new AWS.DynamoDB();
const TableName = process.argv[3];


const insertDataToDynamo = async (jsonData) => {
  try {
    let records = getRecords(jsonData)
    let batches = [];
    while (records.length) {
      batches.push(records.splice(0, 25));
    }
    await callDynamoDBInsert(batches);
  } catch (error) {
    console.log(error);
    return error;
  }
}

const getRecords = (data) => {
  let records = data.map(entity => {
    // Format element in the correct format for DynamoDB's API 
    let record = {
      PutRequest: {
        Item: attr.wrap(entity)
      }
    };
    return record
  })

  return records
}

const callDynamoDBInsert = async (batches) => {
  batches.map(batch => {
    // insert per batch
    let params = {
      RequestItems: {}
    };
    params["RequestItems"][TableName] = batch; // TODO -> check if table exist on DynamoDB, can decide to create, but that will be something to see
    // Async function call to write the items to the DB 
    ddb.batchWriteItem(params, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);
      }
    });
  })
}

const main = async () => {
  try {
    const data = await insertDataToDynamo(jsonData);
    console.log("Success, items inserted: ", data);
  } catch(err) {
    console.log("Error", err);
  }
}

main();
