import { createFileRoute } from '@tanstack/react-router';
import { PaymentHistory } from '@/modules/payment';

export const Route = createFileRoute('/_auth/_auth/payment-history')({
  component: PaymentHistory,
});
