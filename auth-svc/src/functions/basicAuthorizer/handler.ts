import { middyfy } from '@libs/lambda';
import { APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import { randomUUID } from 'crypto';

const AUTHORIZATION_HEADER = 'Authorization';

const checkAuthorization = (headerValue: string) => {
  const valueToDecode = headerValue.split(' ')[1];
  const encoded = Buffer.from(valueToDecode, 'base64').toString('utf8');
  const savedValue = `Angoulema:${process.env.Angoulema}`;
  return encoded === savedValue;
};

const basicAuthorizer = async (event: APIGatewayRequestAuthorizerEvent) => {
  const { headers } = event;
  const authHeader = headers[AUTHORIZATION_HEADER];
  const correlationId = randomUUID();
  const isAuthorized = checkAuthorization(authHeader);
  return {
    principalId: correlationId,
    policyDocument: {
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: isAuthorized ? 'Allow' : 'Deny',
        Resource: '*'
      }]
    }
  };
};

export const main = basicAuthorizer;
