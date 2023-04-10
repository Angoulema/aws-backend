import { BatchWriteItemCommand, DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { Product } from "src/types";
import { Stock } from "../types";
import { createPutRequests } from "../utils/create-batch-put-requests";
import { getRandomNumber } from "../utils/generate-number-from-range";

const generateStock = (ids: string[]): Stock[] => ids.map((id) => ({
  id,
  count: getRandomNumber(3, 50)
}))

async function fillTable(tableName: string) {
  const documentClient = new DynamoDBClient({});

  const productTable = 'aws-course-products';
  // ignoring pagination and scan limits, as mock data for now isn't expected to be of big volume
  const scanQuery = new ScanCommand({
    TableName: productTable
  })
  const scanResult = await documentClient.send(scanQuery);
  const productData = scanResult.Items.map((item) => unmarshall(item) as Product);
  const ids = productData.map(({ productId }) => productId);
  const stockData = generateStock(ids);

  const putRequests = createPutRequests(stockData);
  const params = {
    RequestItems: {
      [tableName]: putRequests
    }
  };
  const command = new BatchWriteItemCommand(params);
  const result = await documentClient.send(command);

  if (result.UnprocessedItems && Object.values(result.UnprocessedItems).length) {
    console.log('Unprocessed items during batch put operation', result.UnprocessedItems);
  }
}

// to run: ENV_NAME=dev AWS_REGION=us-east-1 AWS_PROFILE=sandx ts-node src/scripts/fill-stockTable-with-random-data.ts
(async () => {
  const table = 'aws-course-stock';
  console.log('Start seeding stock table');
  await fillTable(table);
  console.log('Data was put');
})()
