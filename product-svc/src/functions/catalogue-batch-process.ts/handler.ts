import { SQSEvent } from "aws-lambda";
import logger from '../../service-logger';
import { ProductService } from "../../services/product-service";
import { ProductInput } from "../../types";
import { eventToDynamoMapping } from "../../constants";
import { SNSservice } from "../../services/sns-service";

const TOPIC_NAME = 'createProductTopic';

const validateSqsEvent = (event: SQSEvent) => {
  if (!event.Records.length) {
    throw new Error('Empty SQS Event');
  }
  return event;
}

  const catalogueBatchProcess = async (event: SQSEvent): Promise<void> => {
    try {
      const validatedEvent = validateSqsEvent(event);
      const productService = new ProductService();
      const snsService = new SNSservice();
      for (const record of validatedEvent.Records) {
        const body = JSON.parse(record.body);
        const bodyRemapped: ProductInput = Object.keys(body).reduce((acc, key) => {
          const cleanKey = key.replace('\ufeff', '');
          const newKey = eventToDynamoMapping[cleanKey];
          acc[newKey] = body[key];
          return acc;
        }, {} as ProductInput);
        await productService.addProductRepresentation(bodyRemapped);
        await snsService.sendMessage('Product was added', TOPIC_NAME);
      }
      logger.info({ messagesProcessed: event.Records.length }, 'Lambda successfully finished, notifications sent');
    } catch (err) {
      logger.error(err, 'Lambda finished with as error');
      throw err;
    }
};

export const main = catalogueBatchProcess;
