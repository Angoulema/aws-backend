import { SNSClient, PublishCommand  } from '@aws-sdk/client-sns';

export class SNSservice {
  private client: SNSClient;

  constructor() {
    const region = process.env.REGION;
    this.client = new SNSClient({ region });
  }

  private getTopicArn(topicName: string) {
    const region = process.env.REGION;
    const id = process.env.ACCOUNT;
    return `arn:aws:sns:${region}:${id}:${topicName}`
  }

  public async sendMessage(message: string, topicName: string) {
    const topicArn = this.getTopicArn(topicName);
    const params = {
      Message: message,
      TopicArn: topicArn
    };
    const command = new PublishCommand(params);
    const data = await this.client.send(command);
    return data;
  }
}
