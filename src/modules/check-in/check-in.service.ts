import { CheckIn, CheckinRepository } from '@/modules/check-in';

export class CheckInServiceImpl {
  private checkInRepository: CheckinRepository;

  constructor(checkInRepository: CheckinRepository) {
    this.checkInRepository = checkInRepository;
  }

  async createCheckIn(memberId: string): Promise<CheckIn> {
    return this.checkInRepository.create(memberId);
  }

  async getCheckIns(): Promise<CheckIn[]> {
    return this.checkInRepository.getAll();
  }

  async getCheckInsByMemberId(memberId: string): Promise<CheckIn | null> {
    return this.checkInRepository.getById(memberId);
  }
}
