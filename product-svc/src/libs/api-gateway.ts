import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyPostEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedPostEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyPostEvent<S>, APIGatewayProxyResult>

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
    body: JSON.stringify({ msg: message })
  }
}
