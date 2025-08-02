import { Payment } from '@/modules/payment';

export class PaymentRepository {
  async getAll(): Promise<Payment[]> {
    return window.api.payments.find({});
  }

  async getById(id: string): Promise<Payment | null> {
    const docs = await window.api.payments.find({ id });
    return docs[0] || null;
  }

  async create(memberId: string, amount: number): Promise<Payment> {
    const doc = {
      memberId,
      amount,
      status: 'Paid',
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return window.api.payments.insert(doc);
  }

  async update(id: string, payment: Payment): Promise<Payment> {
    await window.api.payments.update(id, {
      ...payment,
      updatedAt: new Date().toISOString(),
    });
    return (await this.getById(id)) as Payment;
  }

  async delete(id: string): Promise<void> {
    await window.api.payments.remove(id);
  }
}
