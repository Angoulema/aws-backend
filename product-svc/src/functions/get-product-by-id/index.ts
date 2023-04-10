import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        cors: true
      },
    },
  ],
  environment: {
    PRODUCT_TABLE: 'aws-course-products',
    STOCK_TABLE: 'aws-course-stock'
  }
};
