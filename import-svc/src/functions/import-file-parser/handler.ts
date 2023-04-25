import { S3Event } from 'aws-lambda';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { S3Service } from '../../services/s3-service';

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
    const readStream = await s3Service.getReadableStream(params);
    // const pass = new PassThrough();
    await new Promise((res) => {
      (readStream as Readable).pipe(csv())
        .on('data', (chunk: any) => {
          console.log(chunk);
        })
        .on('close', res)
        .on('error', (err) => {
          throw err
        });
    })
  
    // move to diff folder
    await s3Service.moveFileWithinBucket(bucket.name, 'parsed', object.key);
    console.log('File moved to another folder');

  } catch(err) {
    console.error('Lambda finished with error', err)
  }
}

export const main = importFileParser;
