import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/get-products-list';
import getProductById from '@functions/get-product-by-id';
import postProduct from '@functions/post-product';
import catalogueBatchProcess from '@functions/catalogue-batch-process.ts';

const serverlessConfiguration: AWS = {
  service: 'product-svc',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    profile: 'sandx',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              "dynamodb:BatchGetItem",
              "dynamodb:BatchWriteItem",
              "dynamodb:DeleteItem",
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:Query",
              "dynamodb:UpdateItem",
              "dynamodb:Scan",
              "dynamodb:DescribeTable"
            ],
            Resource: "arn:aws:dynamodb:us-east-1:622450868234:table/aws-course-products"
          },
          {
            Effect: 'Allow',
            Action: [
              "dynamodb:*"
            ],
            Resource: "arn:aws:dynamodb:us-east-1:622450868234:table/aws-course-stock"
          }
        ]
      }
    }
  },
  // import the function via paths
  functions: { 
    getProductsList,
    getProductById,
    postProduct,
    catalogueBatchProcess
  },
  package: { individually: true },
  resources: {
    Resources: {
      'catalogItems': {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItems'
        }
      }
    }
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
