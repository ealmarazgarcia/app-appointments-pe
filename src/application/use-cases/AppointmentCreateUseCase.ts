import { Appointment, AppointmentStatusType } from '../../domain/entities/Appointment';
import { AppointmentRepository } from '../../domain/repositories/AppointmentRepository';

export class AppointmentCreateUseCase {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(message: any): Promise<void> {
    try {
      if (!message.Message) throw new Error('El campo Message es requerido en el mensaje SQS');

      let snsPayload;
      try {
        snsPayload = typeof message.Message === 'string' ? JSON.parse(message.Message) : message.Message;
      } catch (err) {
        throw new Error('El campo Message no es un JSON válido');
      }

      if (snsPayload.event !== 'AppointmentCreated') return;

      const data = snsPayload.data;
      if (!data.insuredId) throw new Error('insuredId es requerido');
      if (!data.scheduleId) throw new Error('scheduleId es requerido');
      if (!data.countryISO || !['PE', 'CL'].includes(data.countryISO)) throw new Error('countryISO debe ser PE o CL');
      
      const scheduleIdStr = String(data.scheduleId);
      if (scheduleIdStr.length < 4) throw new Error('scheduleId debe tener al menos 4 dígitos');

      const centerId = parseInt(scheduleIdStr[0], 10);
      const specialtyId = parseInt(scheduleIdStr[1], 10);
      const medicId = parseInt(scheduleIdStr[2], 10);
      const date = parseInt(scheduleIdStr.slice(3), 10);
      const scheduleId = parseInt(`${centerId}${specialtyId}${medicId}${date}`, 10);
      
      const appointment = new Appointment(
        data.insuredId,
        scheduleId,
        data.countryISO as 'PE' | 'CL',
        'completed'
      );

      await this.appointmentRepository.create(appointment);
    } catch (error) {
      console.error('Error en AppointmentCreateUseCase:', error);
      throw error;
    }
  }
} 