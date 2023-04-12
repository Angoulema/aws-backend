import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"

export type ValidatedEventAPIGatewayProxyEvent = Handler<APIGatewayProxyEvent, APIGatewayProxyResult>

export const formatJSONResponse = (response: Record<string, unknown> | Record<string, unknown>[]) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}

export const formatErrorResponse = (code: number, message: string) => {
  return {
    statusCode: code,
    body: message 
  }
}
