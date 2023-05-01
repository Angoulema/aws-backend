import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

export class SQSservice {
  private client: SQSClient;

  constructor() {
    const region = process.env.REGION;
    this.client = new SQSClient({ region });
  }

  private getQueueUrl(queueName: string) {
    const { REGION, ACCOUNT } = process.env;
    return `https://sqs.${REGION}.amazonaws.com/${ACCOUNT}/${queueName}`;
  }

  public  async sendMessage(message: any, queueName: string) {
    const queueUrl = this.getQueueUrl(queueName);
    const params = {
      DelaySeconds: 5,
      MessageBody: JSON.stringify(message),
      QueueUrl: queueUrl
    };
    const command = new SendMessageCommand(params);
    await this.client.send(command);
  }
}
