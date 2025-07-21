import { SchedulesCreateUseCase } from './SchedulesCreateUseCase';
import { AppointmentCreateUseCase } from './AppointmentCreateUseCase';

export class ProcessMessageUseCase {
  constructor(
    private schedulesCreateUseCase: SchedulesCreateUseCase,
    private appointmentCreateUseCase: AppointmentCreateUseCase
  ) {}

  async execute(message: any): Promise<void> {
    await this.schedulesCreateUseCase.execute(message);
    await this.appointmentCreateUseCase.execute(message);
  }
} 