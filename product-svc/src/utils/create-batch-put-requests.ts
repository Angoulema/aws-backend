import { marshall } from "@aws-sdk/util-dynamodb";

export const createPutRequests = (data: any[]) => data.map((item) => ({
  PutRequest: {
    Item: marshall(item)
  }
}));
