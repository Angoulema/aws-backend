import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        arn: 'arn:aws:sqs:us-east-1:622450868234:catalogItems',
        batchSize: 5,
        maximumBatchingWindow: 300
      }
    },
  ],
  environment: {
    PRODUCT_TABLE: 'aws-course-products',
    STOCK_TABLE: 'aws-course-stock',
    REGION: 'us-east-1',
    ACCOUNT: '622450868234'
  }
};
