import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        request: {
          parameters: {
            querystrings: {
              name: true
            }
          }
        },
        cors: true,
        authorizer: {
          arn: 'arn:aws:lambda:us-east-1:622450868234:function:auth-svc-dev-basicAuthorizer',
          type: 'request'
        }
      },
    },
  ],
  environment: {
    BUCKET_NAME: 'import-data-storage'
  }
};
