import { SQSEvent } from "aws-lambda";
import logger from '../../service-logger';
import { ProductService } from "../../services/product-service";
import { ProductInput } from "../../types";
import { eventToDynamoMapping } from "../../constants";

const validateSqsEvent = (event: SQSEvent) => {
  if (!event.Records.length) {
    throw new Error('Empty SQS Event');
  }
  return event;
}

  const catalogueBatchProcess = async (event: SQSEvent): Promise<void> => {
    logger.info(event, 'Incoming event');
    try {
      const validatedEvent = validateSqsEvent(event);
      const service = new ProductService();
      for (const record of validatedEvent.Records) {
        const body = JSON.parse(record.body);
        logger.info({ body }, 'Incoming body from message');
        const bodyRemapped: ProductInput = Object.keys(body).reduce((acc, key) => {
          const cleanKey = key.replace('\ufeff', '');
          const newKey = eventToDynamoMapping[cleanKey];
          acc[newKey] = body[key];
          return acc;
        }, {} as ProductInput);
        logger.info({ bodyRemapped }, 'Remapped body of event');
        await service.addProductRepresentation(bodyRemapped);
      }
      logger.info({ messagesProcessed: event.Records.length }, 'Lambda successfully finished');
    } catch (err) {
      logger.error(err, 'Lambda finished with as error');
      throw err;
    }
};

export const main = catalogueBatchProcess;
