import { Schedules } from '../entities/Schedules';

export interface SchedulesRepository {
  create(schedule: Schedules): Promise<void>;
} 