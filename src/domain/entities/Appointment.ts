import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Check } from 'typeorm';
import { Schedules } from './Schedules';

export type AppointmentStatusType = 'pending' | 'completed';

@Entity('AppointmentStatus')
@Check(`countryISO IN ('PE', 'CL')`)
export class Appointment {
  @PrimaryGeneratedColumn()
  appointmentId: number;

  @Column({ type: 'varchar', length: 5 })
  insuredId: string;

  @Column('bigint')
  scheduleId: number;

  @ManyToOne(() => Schedules)
  @JoinColumn({ name: 'scheduleId' })
  schedule: Schedules;

  @Column({ type: 'char', length: 2 })
  countryISO: 'PE' | 'CL';

  @Column({ type: 'enum', enum: ['pending', 'completed'] })
  status: AppointmentStatusType;

  constructor(
    insuredId: string,
    scheduleId: number,
    countryISO: 'PE' | 'CL',
    status: AppointmentStatusType
  ) {
    this.insuredId = insuredId;
    this.scheduleId = scheduleId;
    this.countryISO = countryISO;
    this.status = status;
  }
} 