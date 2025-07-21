export interface IProcessMessageService {
  process(message: any): Promise<void>;
} 