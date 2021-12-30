# dynamodb-upload-json
Upload JSON Data in Bulk to a DynamoDB using CLI

# How to Use

NB: Make sure AWS is configure with Access Key and Secret
    AWS SDK is set for the terminal
- `npm install -g dynamodb-upload-json`
- `cd file-where-json-file-is` 
- `dynamodb-upload-json jsonFilePathName dynamoDbName awsRegion`

Example 

`dynamodb-upload-json data exampledate eu-west-2` where data will represent the file `data.json`
# Updates

- I will be making more updates soon for this package

# License

MIT 
