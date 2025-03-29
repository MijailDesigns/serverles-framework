import boto3, json, os

client = boto3.resource("dynamodb")

IS_OFFLINE = os.environ.get("IS_OFFLINE", False)

if IS_OFFLINE:
  client = boto3.resource("dynamodb", endpoint_url="http://localhost:8000")

table = client.Table("usersTable")

def delete_users(event, context):
  user_id = event['pathParameters']['id']
  result = table.delete_item(Key = {"pk": user_id})
  body = json.dumps({
    "message": f"user {user_id} deleted",
  })
  response = {
    "statusCode": result["ResponseMetadata"]["HTTPStatusCode"],
    "body": body
  }
  return response
  

