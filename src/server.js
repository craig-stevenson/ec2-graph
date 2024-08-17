const express = require('express')
const { S3Client, ListBucketsCommand } = require("@aws-sdk/client-s3");
const app = express()
const port = 3000

app.get('/', async (req, res, next) => {
  try {
    process.env['AWS_ACCESS_KEY_ID'] = '';
    process.env['AWS_SECRET_ACCESS_KEY'] = '';

    const CONFIG = {
      region: 'us-east-1'
    };
    const client = new S3Client(CONFIG);
    const command = new ListBucketsCommand({});
    const response = await client.send(command);
    res.json(response.Buckets);
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});