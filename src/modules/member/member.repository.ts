import { CreateMemberData, Member, UpdateMemberData } from '@/modules/member';

export class MemberRepository {
  async getAll(): Promise<Member[]> {
    return window.api.members.find({});
  }

  async getById(id: string): Promise<Member | null> {
    const docs = await window.api.members.find({ id });
    return docs[0] || null;
  }

  async create(member: CreateMemberData): Promise<Member> {
    const doc = { ...member, id: crypto.randomUUID(), status: 'Active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    return window.api.members.insert(doc);
  }

  async update(id: string, member: UpdateMemberData): Promise<Member> {
    await window.api.members.update(id, { ...member, updatedAt: new Date().toISOString() });
    return await this.getById(id) as Member;
  }

  async delete(id: string): Promise<void> {
    await window.api.members.remove(id);
  }
}