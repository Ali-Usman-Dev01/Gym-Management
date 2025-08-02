import {
  CreateMembershipPlanData,
  MembershipPlan,
  UpdateMembershipPlanData,
} from '@/modules/membership-plan';

export class PlanRepository {
  async getAll(): Promise<MembershipPlan[]> {
    return window.api.plans.find({});
  }

  async getById(id: string): Promise<MembershipPlan | null> {
    const docs = await window.api.plans.find({ id });
    return docs[0] || null;
  }

  async create(plan: CreateMembershipPlanData): Promise<MembershipPlan> {
    const doc = { ...plan, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    return window.api.plans.insert(doc);
  }

  async update(id: string, plan: UpdateMembershipPlanData): Promise<MembershipPlan> {
    await window.api.plans.update(id, { ...plan, updatedAt: new Date().toISOString() });
    const updated =  await this.getById(id);
    return updated as MembershipPlan
  }

  async delete(id: string): Promise<void> {
    await window.api.plans.remove(id);
  }
}
