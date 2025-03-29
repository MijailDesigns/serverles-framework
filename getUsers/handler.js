const aws = require("aws-sdk");

let dynamoDbClientParams = {};

if (process.env.IS_OFFLINE) {
  dynamoDbClientParams = {
    region: "localhost",
    endpoint: "http://localhost:8000",
  };
}

const dynamoDb = new aws.DynamoDB.DocumentClient(dynamoDbClientParams);

const getUsers = async (event, context) => {
  const userId = event.pathParameters.id;
  const params = {
    ExpressionAttributeValues: { ":pk": userId },
    KeyConditionExpression: "pk = :pk",
    TableName: "usersTable",
  };

  return dynamoDb
    .query(params)
    .promise()
    .then((data) => {
      return {
        statusCode: 200,
        body: JSON.stringify({ user: data.Items }),
      };
    });
};

const bye = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Esto es un mensaje de despedida",
    }),
  };
};

const postBody = async (event, context) => {
  let body = JSON.parse(event.body);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Esto es un mensaje de post ${body.name} y esto vino por post`,
    }),
  };
};

const postParam = async (event, context) => {
  let param = event.pathParameters.id;

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Esto es un mensaje de get ${param} y es param`,
    }),
  };
};

module.exports = {
  getUsers,
  bye,
  postBody,
  postParam,
};
