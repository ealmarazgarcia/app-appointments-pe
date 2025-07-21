import { SchedulesRepositoryImp } from '../../infrastructure/persistence/SchedulesRepositoryImp';
import { AppointmentRepositoryImp } from '../../infrastructure/persistence/AppointmentRepositoryImp';
import { SchedulesCreateUseCase } from '../../application/use-cases/SchedulesCreateUseCase';
import { AppointmentCreateUseCase } from '../../application/use-cases/AppointmentCreateUseCase';
import { ProcessMessageUseCase } from '../../application/use-cases/ProcessMessageUseCase';
import { ProcessMessageService } from '../../application/services/ProcessMessageService';
import { DataSource } from 'typeorm';
import { Schedules } from '../../domain/entities/Schedules';
import { Appointment } from '../../domain/entities/Appointment';
import 'reflect-metadata';

class Container {
  private services = new Map();
  private dataSource: DataSource | null = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    
    try {
      this.dataSource = new DataSource({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 3306,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [Schedules, Appointment],
        synchronize: false,
        connectTimeout: 10000,
      });
      
      await this.dataSource.initialize();

      // Repositorios
      const schedulesRepository = new SchedulesRepositoryImp(this.dataSource);
      const appointmentRepository = new AppointmentRepositoryImp(this.dataSource);

      // Casos de uso
      const schedulesCreateUseCase = new SchedulesCreateUseCase(schedulesRepository);
      const appointmentCreateUseCase = new AppointmentCreateUseCase(appointmentRepository);
      const processMessageUseCase = new ProcessMessageUseCase(schedulesCreateUseCase, appointmentCreateUseCase);

      // Servicios
      const processMessageService = new ProcessMessageService(processMessageUseCase);

      this.services.set('IProcessMessageService', processMessageService);
      this.initialized = true;
    } catch (error) {
      console.error('Error inicializando DataSource:', error);
      throw error;
    }
  }

  async resolve<T>(key: string): Promise<T> {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.services.get(key);
  }
}

export const container = new Container(); 