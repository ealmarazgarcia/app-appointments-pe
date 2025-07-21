import { SchedulesRepository } from '../../domain/repositories/SchedulesRepository';
import { Schedules } from '../../domain/entities/Schedules';

export class SchedulesCreateUseCase {
  constructor(private schedulesRepository: SchedulesRepository) {}

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
      if (!data.scheduleId) throw new Error('scheduleId es requerido');

      const scheduleIdStr = String(data.scheduleId);
      if (scheduleIdStr.length < 4) throw new Error('scheduleId debe tener al menos 4 dígitos');

      const centerId = parseInt(scheduleIdStr[0], 10);
      const specialtyId = parseInt(scheduleIdStr[1], 10);
      const medicId = parseInt(scheduleIdStr[2], 10);
      const date = parseInt(scheduleIdStr.slice(3), 10);
      const scheduleId = parseInt(`${centerId}${specialtyId}${medicId}${date}`, 10);

      const schedule = new Schedules(
        scheduleId,
        centerId,
        specialtyId,
        medicId,
        date
      );

      await this.schedulesRepository.create(schedule);
    } catch (error) {
      console.error('Error en SchedulesCreateUseCase:', error);
      throw error;
    }
  }
} 