import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { mockProducts } from '../../services/product-service-mock';

const getProductsList: ValidatedEventAPIGatewayProxyEvent = async (_event) => {
  const productList = await mockProducts.getAllProducts();
  return formatJSONResponse(productList as unknown as Record<string, unknown>[]);
};

export const main = middyfy(getProductsList);
