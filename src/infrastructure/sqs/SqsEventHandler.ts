import 'reflect-metadata';
import { SQSEvent } from 'aws-lambda';
import { container } from '../../shared/di/container';
import { IProcessMessageService } from '../../application/services/IProcessMessageService';
import { sendMessageToSqs } from './SqsPublisher';

export const handler = async (event: SQSEvent) => {
  const processMessageService = await container.resolve<IProcessMessageService>('IProcessMessageService');

  for (const record of event.Records) {
    const message = JSON.parse(record.body);

    await processMessageService.process(message);

    const targetQueueUrl = process.env.TARGET_SQS_URL;
    if (targetQueueUrl) {
      await sendMessageToSqs(targetQueueUrl, message);
    }
  }
};
