import { BatchWriteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { randomBytes, randomUUID } from "crypto";
import { createPutRequests } from "../utils/create-batch-put-requests";
import { Product } from "../types";
import { getRandomNumber } from "../utils/generate-number-from-range";
import logger from '../service-logger';

const mapsNames = ['Ankh-Morpork', 'Discworld', 'Sto Plains'];

const booksNames = ['The Truth', 'Guards! Guards!', 'Feet of Clay', 'Night Watch', 'Thud!', 'Making Money', 'Going Postal'];

const generateData = (): Product[] => {
  const mapData = mapsNames.map((item) => ({
    productId: randomUUID(),
    productName: item,
    productType: 'Map',
    description: randomBytes(20).toString('hex'),
    price: getRandomNumber(10, 20),
    currency: 'GBP'
  }));

  const bookData = booksNames.map((item) => ({
    productId: randomUUID(),
    productName: item,
    productType: 'Book',
    description: randomBytes(20).toString('hex'),
    price: getRandomNumber(20, 60),
    currency: 'GBP'
  }))

  return [...mapData, ...bookData];
};

async function fillTable(tableName: string) {
  const data = generateData();

  const documentClient = new DynamoDBClient({});
  const putRequests = createPutRequests(data);
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

// to run: ENV_NAME=dev AWS_REGION=us-east-1 AWS_PROFILE=sandx ts-node src/scripts/fill-productTable-with-random-data.ts
(async () => {
  const table = 'aws-course-products';
  logger.info('Start seeding product table');
  await fillTable(table);
  logger.info('Data was put');
})()
