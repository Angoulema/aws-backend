import { formatErrorResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { mockProducts } from 'src/services/product-service-mosk';

const getProductById: ValidatedEventAPIGatewayProxyEvent = async (event) => {
  const { pathParameters: { productId }} = event;
  const product = await mockProducts.getProductById(productId);
  return product ? formatJSONResponse(product as unknown as Record<string, unknown>) : formatErrorResponse(404, 'No product with such ID');
};

export const main = middyfy(getProductById);
