import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

const eventBridgeClient = new EventBridgeClient({ 
  region: process.env.AWS_REGION || 'us-east-1',
  maxAttempts: 3,
});

export async function publishAppointmentConfirmed(detail: object) {
  try {
    
    const mensaje = typeof detail.Message === 'string' ? JSON.parse(detail.Message) : detail.Message;
    const appointmentConfirmed = mensaje.data;
    const scheduleIdStr = String(appointmentConfirmed.scheduleId);
    
    const centerId = parseInt(scheduleIdStr[0], 10);
    const specialtyId = parseInt(scheduleIdStr[1], 10);
    const medicId = parseInt(scheduleIdStr[2], 10);
    const date = parseInt(scheduleIdStr.slice(3), 10);
    const scheduleId = parseInt(`${centerId}${specialtyId}${medicId}${date}`, 10);

    const confirmed = { insuredId: appointmentConfirmed.insuredId, scheduleId: appointmentConfirmed.scheduleId, status: 'completed' };

    const command = new PutEventsCommand({
      Entries: [
        {
          Source: 'appointment.service',
          DetailType: 'AppointmentConfirmed',
          Detail: JSON.stringify(confirmed),
          EventBusName: process.env.EVENT_BUS_NAME || 'default',
        },
      ],
    });

    const result = await eventBridgeClient.send(command);
    console.log('Evento publicado exitosamente en EventBridge:', result);
  } catch (error) {
    console.error('Error al publicar evento en EventBridge:', error);
    console.warn('Continuando sin publicar en EventBridge debido al error');
  }
} 