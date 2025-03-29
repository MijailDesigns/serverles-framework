const aws = require("aws-sdk");

let dynamoDbClientParams = {};

if (process.env.IS_OFFLINE) {
  dynamoDbClientParams = {
    region: "localhost",
    endpoint: "http://localhost:8000",
  };
}

const dynamoDb = new aws.DynamoDB.DocumentClient(dynamoDbClientParams);

const getAllUsers = async (event, context) => {
  const params = {
    TableName: "usersTable",
  };

  return dynamoDb
    .scan(params)
    .promise()
    .then((data) => {
      return {
        statusCode: 200,
        body: JSON.stringify({ user: data.Items, count: data.Count }),
      };
    });
};

module.exports = {
  getAllUsers,
};
