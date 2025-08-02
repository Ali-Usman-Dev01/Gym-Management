import { createFileRoute } from '@tanstack/react-router';
import { PaymentPage } from '@/modules/payment';

export const Route = createFileRoute('/_auth/_auth/payment')({
  component: PaymentPage,
});
