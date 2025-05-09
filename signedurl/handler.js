const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  signatureVersion: "v4",
});

const signedUrl = async (event, context) => {
  const fileName = event.queryStringParameters.filename;
  const signedUrl = await s3.getSignedUrlPromise("putObject", {
    Key: `upload/${fileName}`,
    Bucket: process.env.BUCKET,
    Expires: 300,
  });
  return {
    statusCode: 200,
    body: JSON.stringify({ signedUrl }),
  };
};

module.exports = {
  signedUrl,
};
