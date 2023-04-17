import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


export class S3Service {
  private service: S3Client;
  constructor() {
    this.service = new S3Client({
      region: 'us-east-1'
    });
  }

  public async createSignedUrl(params: { Bucket: string, Key: string }): Promise<string> {
    const command = new PutObjectCommand({ ...params, ContentType: 'text/csv' });
    const url = await getSignedUrl(this.service, command, { expiresIn: 3600 });
    return url;
  }
}
