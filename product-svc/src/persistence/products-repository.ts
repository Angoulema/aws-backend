import { DynamoDBClient, ScanCommand, QueryCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Product } from "../types";

export class ProductsRepository {
  private tableName: string;
  private client: DynamoDBClient;
  constructor() {
    this.tableName = process.env.PRODUCT_TABLE;
    this.client = new DynamoDBClient({});
  }

  public async getAllProducts(): Promise<Product[]> {
    const scanQuery = new ScanCommand({
      TableName: this.tableName
    });
    const scanResult = await this.client.send(scanQuery);
    return scanResult.Items.map((item) => unmarshall(item) as Product);
  }

  public async getProductById(id: string): Promise<Product | null> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'productId = :id',
      ExpressionAttributeValues: {
        ':id': {
          'S': id
        }
      }
    };
    const command = new QueryCommand(params);
    const result = await this.client.send(command);
    if (!result.Items.length) {
      return null;
    }
    return unmarshall(result.Items[0]) as Product;
  }

  public async addProduct(item: Product): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: marshall(item)
    };
    const command = new PutItemCommand(params);
    await this.client.send(command);
  }
}
