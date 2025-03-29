const aws = require("aws-sdk");

let dynamoDbClientParams = {};

if (process.env.IS_OFFLINE) {
  dynamoDbClientParams = {
    region: "localhost",
    endpoint: "http://localhost:8000",
  };
}

const dynamoDb = new aws.DynamoDB.DocumentClient(dynamoDbClientParams);

const updateUsers = async (event, context) => {
  const userId = event.pathParameters.id;
  const body = JSON.parse(event.body);

  if (!Object.keys(body).length) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No se recibieron datos" }),
    };
  }

  const updateExpressionParts = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  Object.keys(body).forEach((key) => {
    updateExpressionParts.push(`#${key} = :${key}`);
    expressionAttributeNames[`#${key}`] = key;
    expressionAttributeValues[`:${key}`] = body[key];
  });

  const updateExpression = `SET ${updateExpressionParts.join(", ")}`;

  const params = {
    TableName: "usersTable",
    Key: {
      pk: userId,
    },
    ConditionExpression: "attribute_exists(pk)",
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };

  return dynamoDb
    .update(params)
    .promise()
    .then((data) => {
      return {
        statusCode: 200,
        body: JSON.stringify({ user: data }),
      };
    })
    .catch((error) => {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    });
};

module.exports = {
  updateUsers,
};
