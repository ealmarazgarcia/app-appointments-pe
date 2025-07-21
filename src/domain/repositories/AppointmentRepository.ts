import { Appointment } from '../entities/Appointment';

export interface AppointmentRepository {
  create(appointment: Appointment): Promise<void>;
} 