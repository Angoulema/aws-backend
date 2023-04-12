import { formatErrorResponse, formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { ProductService } from '../../services/product-service';
import logger from '../../service-logger';

const getProductById: ValidatedEventAPIGatewayProxyEvent = async (event, context) => {
  const functionLogger = logger.child({ correlationId: context.awsRequestId });
  functionLogger.info('[start] getProductById lambda');
  try {
    const { pathParameters: { productId }, httpMethod, path } = event;
    functionLogger.info({ method: httpMethod, url: path, params: event.pathParameters }, 'Incoming data');
    const productService = new ProductService();
    const product = await productService.getProductById(productId);
    if (!product) {
      functionLogger.warn({ productId }, 'Product not found');
      return formatErrorResponse(404, 'No product found');
    }
    return formatJSONResponse(product as unknown as Record<string, unknown>);
  } catch(err) {
    functionLogger.error(err)
    formatErrorResponse(500, err.message);
  } finally {
    functionLogger.info('[done] getProductById lambda');
  }
  
};

export const main = middyfy(getProductById);
