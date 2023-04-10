import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { ProductService } from '../../services/product-service';

const getProductsList: ValidatedEventAPIGatewayProxyEvent = async (_event) => {
  const productService = new ProductService();
  const productList = await productService.getAllProducts();
  return formatJSONResponse(productList as unknown as Record<string, unknown>[]);
};

export const main = middyfy(getProductsList);
