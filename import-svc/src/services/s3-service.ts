import { S3Client, PutObjectCommand, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


export class S3Service {
  private service: S3Client;
  constructor() {
    this.service = new S3Client({
      region: 'us-east-1'
    });
  }

  public async createSignedUrl(params: { Bucket: string, Key: string }): Promise<string> {
    const command = new PutObjectCommand({ ...params, ContentType: 'text/csv', ACL: 'public-read' });
    const url = await getSignedUrl(this.service, command, { expiresIn: 3600 });
    return url;
  }

  public async getReadableStream(params: { Bucket: string, Key: string }) {
    const command = new GetObjectCommand(params);
    const item = this.service.send(command);
    return (await item).Body;
  }

  public async moveFileWithinBucket(bucketName: string, moveTo: string, filePath: string) {
    const [,fileName] = filePath.split('/');
    const copyCommand = new CopyObjectCommand({
      CopySource: `${bucketName}/${filePath}`,
      Bucket: bucketName,
      Key: `${moveTo}/${fileName}`
    });
  
    await this.service.send(copyCommand);
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: filePath
    });
    await this.service.send(deleteCommand);
  }
}
