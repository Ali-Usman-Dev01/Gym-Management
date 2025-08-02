import { CheckIn } from '@/modules/check-in';
import { MemberRepository } from '../member';

export class CheckinRepository {
  async getAll(): Promise<CheckIn[]> {
    return window.api.checkins.find({});
  }

  async getById(id: string): Promise<CheckIn | null> {
    const docs = await window.api.checkins.find({ id });
    return docs[0] || null;
  }

  async create(memberId: string): Promise<CheckIn> {
    const memberRepo = new MemberRepository();
    const member = await memberRepo.getById(memberId);
    const doc = {
      memberId,
      member,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return await window.api.checkins.insert(doc);
  }

  async update(id: string, checkin: CheckIn): Promise<CheckIn> {
    await window.api.checkins.update(id, {
      ...checkin,
      updatedAt: new Date().toISOString(),
    });
    return (await this.getById(id)) as CheckIn;
  }

  async delete(id: string): Promise<void> {
    await window.api.checkins.remove(id);
  }
}
