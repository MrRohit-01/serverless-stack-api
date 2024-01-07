import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableName,
    FilterExpression: "begins_with(content, :prefix)",
    ExpressionAttributeValues: {
      ":prefix": "What"
    }
  };

  const scanResult = await dynamoDb.scan(params);

  const deletePromises = scanResult.Items.map(item => {
    const deleteParams = {
      TableName: process.env.tableName,
      Key: {
        userId: item.userId,
        noteId: item.noteId
      }
    };

    return dynamoDb.delete(deleteParams);
  });

  await Promise.all(deletePromises);

  return { status: true };
});
