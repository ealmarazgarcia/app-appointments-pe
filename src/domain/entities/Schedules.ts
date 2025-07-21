import 'reflect-metadata';
import { Entity, PrimaryColumn, Column, Unique } from 'typeorm';

@Entity('Schedules')
@Unique(['centerId', 'specialtyId', 'medicId', 'date'])
export class Schedules {
  @PrimaryColumn('bigint')
  scheduleId: number;

  @Column('bigint')
  centerId: number;

  @Column('bigint')
  specialtyId: number;

  @Column('bigint')
  medicId: number;

  @Column('bigint')
  date: number;

  constructor(
    scheduleId: number,
    centerId: number,
    specialtyId: number,
    medicId: number,
    date: number
  ) {
    this.scheduleId = scheduleId;
    this.centerId = centerId;
    this.specialtyId = specialtyId;
    this.medicId = medicId;
    this.date = date;
  }
} 