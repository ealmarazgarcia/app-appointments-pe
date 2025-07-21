import { SchedulesRepository } from '../../domain/repositories/SchedulesRepository';
import { Schedules } from '../../domain/entities/Schedules';
import { DataSource, Repository } from 'typeorm';

export class SchedulesRepositoryImp implements SchedulesRepository {
  private repo: Repository<Schedules>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Schedules);
  }

  async create(schedule: Schedules): Promise<void> {
    await this.repo.save(schedule);
  }
}