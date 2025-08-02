import {
  Payment,
  PaymentWithMember,
  PaymentRepository,
} from '@/modules/payment';

export class PaymentService {
  private paymentRepository: PaymentRepository;

  constructor(paymentRepository: PaymentRepository) {
    this.paymentRepository = paymentRepository;
  }

  async initiatePayment({
    amount,
    memberId,
  }: {
    amount: number;
    memberId: string;
  }): Promise<Payment> {
    return await this.paymentRepository.create(memberId, amount);
  }

  async confirmPayment(
    paymentIntentId: string,
    payment: Payment,
  ): Promise<void> {
    await this.paymentRepository.update(paymentIntentId, payment);
  }

  async getPaymentHistory(): Promise<Payment[]> {
    return await this.paymentRepository.getAll();
  }

  async getPaymentsWithMembers(id: string): Promise<Payment | null> {
    return await this.paymentRepository.getById(id);
  }
}
