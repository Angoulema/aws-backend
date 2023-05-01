import { S3Event } from 'aws-lambda';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { S3Service } from '../../services/s3-service';
import { SQSservice } from '../../services/sqs-service';

const queueName = 'catalogItems';

const validateEvent = (e: S3Event) => {
  if (!Array.isArray(e.Records) || !e.Records.length) {
    throw new Error('Invalid event');
  }
  return e;
}

const importFileParser = async(event: S3Event) => {
  try {
    const validatedEvent = validateEvent(event);
    const [data] = validatedEvent.Records;
    const { s3: { bucket, object } } = data;
    const params = {
      Bucket: bucket.name,
      Key: object.key
    };

    const s3Service = new S3Service();
    const sqsService = new SQSservice();
    const readStream = await s3Service.getReadableStream(params);
    const messages = [];
    await new Promise((res) => {
      (readStream as Readable).pipe(csv())
        .on('data', (chunk: any) => {
          messages.push(chunk);
        })
        .on('close', res)
        .on('error', (err) => {
          throw err
        });
    });
    for (const message of messages) {
      await sqsService.sendMessage(message, queueName);
    }
  
    // move to diff folder
    await s3Service.moveFileWithinBucket(bucket.name, 'parsed', object.key);

  } catch(err) {
    console.error('Lambda finished with error', err)
  }
}

export const main = importFileParser;
