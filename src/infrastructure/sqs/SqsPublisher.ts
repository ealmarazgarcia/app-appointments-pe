import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const sqsClient = new SQSClient({ region: process.env.AWS_REGION || 'us-east-1' });

export async function sendMessageToSqs(queueUrl: string, messageBody: object) {
  try {
    const mensaje = typeof messageBody.Message === 'string' ? JSON.parse(messageBody.Message) : messageBody.Message;
    const appointmentConfirmed = mensaje.data;
    const scheduleIdStr = String(appointmentConfirmed.scheduleId);
    
    const centerId = parseInt(scheduleIdStr[0], 10);
    const specialtyId = parseInt(scheduleIdStr[1], 10);
    const medicId = parseInt(scheduleIdStr[2], 10);
    const date = parseInt(scheduleIdStr.slice(3), 10);
    const scheduleId = parseInt(`${centerId}${specialtyId}${medicId}${date}`, 10);

    const confirmed = { insuredId: appointmentConfirmed.insuredId, scheduleId: appointmentConfirmed.scheduleId, status: 'completed' };

    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(confirmed),
    });

    const result = await sqsClient.send(command);
    return result;
  } catch (error) {
    console.error('Error enviando mensaje a SQS:', error);
    throw error;
  }
}
