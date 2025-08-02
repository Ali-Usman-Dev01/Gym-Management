import {
  CreateMembershipPlanData,
  MembershipPlan,
  UpdateMembershipPlanData,
  PlanRepository,
} from '@/modules/membership-plan';

export class membershipPlanService {
  private membershipPlanRepository: PlanRepository;

  constructor(
    membershipPlanRepository: PlanRepository = new PlanRepository(),
  ) {
    this.membershipPlanRepository = membershipPlanRepository;
  }

  async getAllMembershipPlans(): Promise<MembershipPlan[]> {
    return this.membershipPlanRepository.getAll();
  }

  async createMembershipPlan(
    plan: CreateMembershipPlanData,
  ): Promise<MembershipPlan> {
    return this.membershipPlanRepository.create(plan);
  }

  async updateMembershipPlan(
    id: string,
    plan: UpdateMembershipPlanData,
  ): Promise<MembershipPlan> {
    return this.membershipPlanRepository.update(id, plan);
  }

  async deleteMembershipPlan(id: string): Promise<void> {
    await this.membershipPlanRepository.delete(id);
  }
}
