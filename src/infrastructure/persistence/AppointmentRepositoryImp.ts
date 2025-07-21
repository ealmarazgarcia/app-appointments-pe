import { AppointmentRepository } from '../../domain/repositories/AppointmentRepository';
import { Appointment } from '../../domain/entities/Appointment';
import { DataSource, Repository } from 'typeorm';

export class AppointmentRepositoryImp implements AppointmentRepository {
  private repo: Repository<Appointment>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Appointment);
  }

  async create(appointment: Appointment): Promise<void> {
    await this.repo.save(appointment);
  }
}