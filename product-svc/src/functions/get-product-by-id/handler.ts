import { formatErrorResponse, ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { ProductService } from '../../services/product-service';

const getProductById: ValidatedEventAPIGatewayProxyEvent = async (event) => {
  const { pathParameters: { productId }} = event;
  const productService = new ProductService();
  const product = await productService.getProductById(productId);
  return product ? formatJSONResponse(product as unknown as Record<string, unknown>) : formatErrorResponse(404, 'No product found');
};

export const main = middyfy(getProductById);
