import React, { useEffect, useState } from 'react';
import {
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Autocomplete,
  TextField,
  Select,
} from '@mui/material';

export function PaymentForm({
  onPaymentCreated,
}: {
  onPaymentCreated: () => void;
}) {
  const [members, setMembers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [memberId, setMemberId] = useState('');
  const [planId, setPlanId] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    window.api.members.find({}).then(setMembers);
    window.api.plans.find({}).then(setPlans);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.api.payments
      .insert({
        id: crypto.randomUUID(),
        memberId,
        planId,
        amount: Number(amount),
        createdAt: new Date().toISOString(),
      })
      .then(() => {
        setMemberId('');
        setPlanId('');
        setAmount('');
        onPaymentCreated();
      });
  };

  return (
    <>
      <Typography variant="h5" fontWeight={'bold'} sx={{ mt: 4 }}>
        Create Payment
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', gap: 2, mb: 4, mt: 4 }}
      >
        <FormControl fullWidth>
          <Autocomplete
            options={members}
            getOptionLabel={(option) => option.phone}
            value={members.find((m) => m.id === memberId) || null}
            onChange={(_, value) => setMemberId(value ? value.id : '')}
            renderInput={(params) => (
              <TextField {...params} label="Member Phone" required />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="plan-label">Membership Plan</InputLabel>
          <Select
            labelId="plan-label"
            value={planId}
            label="Membership Plan"
            onChange={(e) => setPlanId(e.target.value)}
            required
          >
            {plans.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          type="submit"
          sx={{ minWidth: '200px' }}
          variant="contained"
          color="primary"
        >
          Add Payment
        </Button>
      </Box>
    </>
  );
}
