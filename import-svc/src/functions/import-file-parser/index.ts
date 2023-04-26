import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: 'import-data-storage',
        event: 's3:ObjectCreated:*',
        rules: [{
          prefix: 'uploaded'
        }],
        existing: true
      },
    },
  ],
  environment: {
    REGION: 'us-east-1',
    ACCOUNT: '622450868234'
  }
};
