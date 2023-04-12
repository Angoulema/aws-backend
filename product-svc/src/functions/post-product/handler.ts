import { formatErrorResponse, formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { validateProductBody } from '../../utils/validate-product-body';
import { ZodError } from 'zod';
import { ProductService } from '../../services/product-service';
import logger from '../../service-logger';

const postProduct: ValidatedEventAPIGatewayProxyEvent = async (event, context) => {
  const functionLogger = logger.child({ correlationId: context.awsRequestId });
  functionLogger.info('[start] postProduct lambda');
  const { body, path, httpMethod } = event;
  const bodyParsed = JSON.parse(body);
  functionLogger.info({ method: httpMethod, url: path, params: event.pathParameters, body: bodyParsed }, 'Incoming data');
  try {
    const validBody = validateProductBody(bodyParsed);
    const productService = new ProductService();
    const result = await productService.addProductRepresentation(validBody);
    if (!result) {
      throw new Error('Product not added');
    }
    return formatJSONResponse(validBody);
  } catch(err) {
    if (err instanceof ZodError) {
      const logData = err.issues.map((issue) => {
        const { path, message } = issue;
        return `${path[0]} ${message}`;
      });
      const dataToReturn = logData.join('; ');
      functionLogger.warn(`Validation error: ${dataToReturn}`)
      return formatErrorResponse(400, `Invalid body: ${dataToReturn}`);
    }
    functionLogger.error(err);
    return formatErrorResponse(500, err.message);
  } finally {
    functionLogger.info('[done] postProduct lambda');
  }
}

export const main = middyfy(postProduct);
