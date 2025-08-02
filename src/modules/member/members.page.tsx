import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Member,
  MemberStatus,
  UpdateMemberData,
  useDeleteMember,
  useGetMembers,
  useUpdateMember,
} from '@/modules/member';
import { FormEvent, useState, useMemo } from 'react';
import { LoadingAnimation } from '@/components';

export function MembersPage() {
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const { mutate: updateMember } = useUpdateMember();
  const { mutate: deleteMember } = useDeleteMember();
  const { data: members = [], isLoading, isError } = useGetMembers();

  const handleEditClick = (member: Member) => {
    setEditingMember(member);
  };

  const handleEditClose = () => {
    setEditingMember(null);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      deleteMember(id);
    }
  };

  const handleUpdateMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingMember) return;

    const formData = new FormData(event.currentTarget);
    const memberData: UpdateMemberData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phone: formData.get('phone') as string,
      status: formData.get('status') as MemberStatus,
    };
    updateMember({ id: editingMember.id, data: memberData });
    handleEditClose();
  };

  const columns: any[] = useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: 120, flex: 1 },
      {
        field: 'firstName',
        headerName: 'First Name',
        width: 130,
        flex: 1,
      },
      {
        field: 'lastName',
        headerName: 'Last Name',
        width: 180,
        flex: 1,
      },
      { field: 'phone', headerName: 'Phone', flex: 1, width: 150 },
      { field: 'status', headerName: 'Status', flex: 1, width: 120 },
      {
        field: 'actions',
        headerName: 'Actions',
        sortable: false,
        minWidth: 100, // minimum width to accommodate icons
        flex: 1,
        renderCell: (params: { row: Member }) => (
          <>
            <Tooltip title="Edit">
              <IconButton
                onClick={() => handleEditClick(params.row)}
                size="small"
                sx={{ color: '#ffffff' }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                onClick={() => handleDeleteClick(params.row.id)}
                size="small"
                sx={{ color: '#ffffff' }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        ),
      },
    ],
    [],
  );

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (isError) {
    return <Typography color="error">An error occurred</Typography>;
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color={'#ffffff'}>
          All Members
        </Typography>
      </Box>
      <DataGrid
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#22223b !important',
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#22223b !important', // Individual header cells
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            color: '#fff',
          },
          '& .MuiDataGrid-menuIconButton': {
            color: '#f50057', // header menu icon color
          },
          '& .MuiDataGrid-sortIcon': {
            color: '#f50057', // sort arrow color
          },
        }}
        rows={members}
        columns={columns}
        autoHeight
      />

      <Dialog open={!!editingMember} onClose={handleEditClose}>
        <DialogTitle>Edit Member</DialogTitle>
        <form onSubmit={handleUpdateMember}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="firstName"
              label="First Name"
              type="text"
              fullWidth
              defaultValue={editingMember?.firstName || ''}
            />
            <TextField
              margin="dense"
              name="lastName"
              label="Last Name"
              type="text"
              fullWidth
              defaultValue={editingMember?.lastName || ''}
            />
            <TextField
              margin="dense"
              name="phone"
              label="Phone"
              type="tel"
              fullWidth
              defaultValue={editingMember?.phone || ''}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                defaultValue={editingMember?.status || 'Active'}
                label="Status"
                variant="outlined"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}
