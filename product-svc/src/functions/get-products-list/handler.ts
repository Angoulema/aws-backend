import { formatErrorResponse, formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { ProductService } from '../../services/product-service';
import logger from '../../service-logger';

const getProductsList: ValidatedEventAPIGatewayProxyEvent = async (event, context) => {
  const functionLogger = logger.child({ correlationId: context.awsRequestId });
  functionLogger.info('[start] getProductsList lambda');
  const { httpMethod, path } = event;
  functionLogger.info({ method: httpMethod, url: path }, 'Incoming data');
  try {
    const productService = new ProductService();
    const productList = await productService.getAllProducts();
    return formatJSONResponse(productList as unknown as Record<string, unknown>[]);
  } catch(err) {
    functionLogger.error(err)
    return formatErrorResponse(500, err.message);
  } finally {
    functionLogger.info('[done] getProductsList lambda');
  }
  
};

export const main = middyfy(getProductsList);
