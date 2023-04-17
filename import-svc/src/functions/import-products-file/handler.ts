import { EventAPIGatewayProxyEvent, formatJSONError, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { S3Service } from 'src/services/s3-service';

const importProductsFile: EventAPIGatewayProxyEvent = async(event) => {
  const { queryStringParameters: { name } } = event;
  try {
    const bucketName = process.env.BUCKET_NAME;

    const s3Service = new S3Service();
    const url = await s3Service.createSignedUrl({ Bucket: bucketName, Key: name });
    return formatJSONResponse({ signedURL: url });
  } catch(err) {
    const { statusCode, ...restFields } = err;
    return formatJSONError(restFields, statusCode);
  }
}

export const main = middyfy(importProductsFile);
