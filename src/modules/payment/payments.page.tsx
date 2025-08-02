import { useState } from 'react';
import { PaymentForm } from './payment-form';
import { PaymentHistory } from './payment-history.page';
import { Typography } from '@mui/material';

export function PaymentPage() {
  const [refresh, setRefresh] = useState(0);

  return (
    <>
      <PaymentForm onPaymentCreated={() => setRefresh((r) => r + 1)} />
      <Typography variant="h5" fontWeight={'bold'}>
        Payment History
      </Typography>
      <PaymentHistory key={refresh} />
    </>
  );
}
