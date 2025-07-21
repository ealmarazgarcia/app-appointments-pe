import { IProcessMessageService } from './IProcessMessageService';
import { ProcessMessageUseCase } from '../use-cases/ProcessMessageUseCase';

export class ProcessMessageService implements IProcessMessageService {
  constructor(private processMessageUseCase: ProcessMessageUseCase) {}

  async process(message: any): Promise<void> {
    await this.processMessageUseCase.execute(message);
  }
} 