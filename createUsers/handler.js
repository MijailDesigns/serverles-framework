const aws = require("aws-sdk");
const { randomUUID } = require("crypto");

let dynamoDbClientParams = {};

if (process.env.IS_OFFLINE) {
  dynamoDbClientParams = {
    region: "localhost",
    endpoint: "http://localhost:8000",
  };
}

const dynamoDb = new aws.DynamoDB.DocumentClient(dynamoDbClientParams);

const createUsers = async (event, context) => {
  const id = randomUUID();
  let body = JSON.parse(event.body);

  const params = {
    TableName: "usersTable",
    Item: {
      pk: id,
      ...body,
    },
  };

  console.log(params.Item);

  return dynamoDb
    .put(params)
    .promise()
    .then((data) => {
      console.log(data);
      return {
        statusCode: 200,
        body: JSON.stringify({ user: params.Item }),
      };
    });
};

module.exports = {
  createUsers,
};
