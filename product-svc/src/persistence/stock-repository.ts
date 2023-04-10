import { DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Stock } from "../types";

export class StockRepository {
  private tableName: string;
  private client: DynamoDBClient;
  constructor() {
    this.tableName = process.env.STOCK_TABLE;
    this.client = new DynamoDBClient({});
  }

  public async getStockById(stockId: string): Promise<Stock | null> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': {
          'S': stockId
        }
      }
    };
    const command = new QueryCommand(params);
    const result = await this.client.send(command);
    if (!result.Items.length) {
      return null;
    }
    return unmarshall(result.Items[0]) as Stock;
  }

  public async addStock(item: Stock) {
    const params = {
      TableName: this.tableName,
      Item: marshall(item)
    };
    const command = new PutItemCommand(params);
    await this.client.send(command);
  }
}
