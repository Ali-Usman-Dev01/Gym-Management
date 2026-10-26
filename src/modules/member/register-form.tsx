import { Box, Button, TextField } from '@mui/material';
import { CreateMemberData, useRegisterMember } from '@/modules/member';
import { useNavigate } from '@tanstack/react-router';

export function RegisterMemberForm() {
  const { mutateAsync: registerMember, isPending } = useRegisterMember();
  const navigate = useNavigate();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const memberData: CreateMemberData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phone: formData.get('phone') as string,
      serial: formData.get('serial') as string,
    };
    await registerMember(memberData);
    navigate({ to: '/members' });
    event.currentTarget.reset();
  };

  return (
    <form onSubmit={onSubmit}>
      <TextField
        fullWidth
        label="First Name"
        name="firstName"
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Last Name"
        name="lastName"
        margin="normal"
        required
      />
      <TextField fullWidth label="Phone" name="phone" margin="normal" />
      <TextField fullWidth label="Serial" name="serial" margin="normal" />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button
          type="submit"
          disabled={isPending}
          variant="contained"
          color="primary"
          size="large"
        >
          {isPending ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
    </form>
  );
}
