// Add to imports
import DeleteIcon from '@mui/icons-material/Delete';
import { CheckIn } from './check-in.model';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { format, parseISO } from 'date-fns';
import { Autocomplete, Box, Button, FormControl, IconButton, Paper, SelectChangeEvent, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useCheckInPage } from './use-check-in-page';
import { LoadingAnimation } from '@/components';
import { Member } from '../member';

// In CheckInTable props, add onDeleteCheckIn
interface SearchableMemberSelectProps {
  selectedMemberId: string;
  onMemberChange: (memberId: string) => void;
  members: Member[];
}

export const SearchableMemberSelect: React.FC<SearchableMemberSelectProps> = ({
  selectedMemberId,
  onMemberChange,
  members,
}) => {
  const handleChange = (_: React.SyntheticEvent, value: Member | null) => {
    if (value) {
      onMemberChange(value.id);
    }
  };

  return (
    <FormControl fullWidth>
      <Autocomplete
        id="member-select-autocomplete"
        options={members}
        getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
        renderInput={(params) => (
          <TextField {...params} label="Select Member" />
        )}
        value={members.find((member) => member.id === selectedMemberId) || null}
        onChange={handleChange}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />
    </FormControl>
  );
};

function CheckInTable({
  checkIns,
  isMobile,
  onDeleteCheckIn,
}: {
  checkIns: CheckIn[];
  isMobile: boolean;
  onDeleteCheckIn: (id: string) => void;
}) {
  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      width: 110,
      flex: 1,
      valueGetter: (_, row) => format(parseISO(row.createdAt), 'dd MMMM YYY'),
    },
    {
      field: 'time',
      headerName: 'Time',
      width: 110,
      flex: 1,
      valueGetter: (_, row) => format(parseISO(row.createdAt ?? ''), 'HH:mm'),
    },
    {
      field: 'firstName',
      headerName: 'First Name',
      width: 130,
      flex: 1,
      valueGetter: (_, row) => row.member.firstName,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      width: 130,
      flex: 1,
      valueGetter: (_, row) => row.member.lastName,
    },
  ];

  if (!isMobile) {
    columns.push({
      field: 'email',
      headerName: 'Email',
      width: 200,
      flex: 1,
      valueGetter: (_, row) => row.member.email,
    });
  }

  // Add delete column
  columns.push({
    field: 'actions',
    headerName: 'Actions',
    width: 100,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <IconButton
        size="small"
        onClick={() => onDeleteCheckIn(params.row.id)}
        sx={{ color: 'white' }}
      >
        <DeleteIcon />
      </IconButton>
    ),
  });

  return (
    <Paper sx={{ width: '100%', height: 'calc(100vh - 300px)' }}>
      <DataGrid
        rows={checkIns}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 20 },
          },
        }}
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#22223b !important',
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#22223b !important',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            color: '#fff',
          },
          '& .MuiDataGrid-menuIconButton': {
            color: '#f50057',
          },
          '& .MuiDataGrid-sortIcon': {
            color: '#f50057',
          },
        }}
        pageSizeOptions={[10, 20, 50]}
        checkboxSelection={false}
        disableRowSelectionOnClick
      />
    </Paper>
  );
}

// In CheckInPage, add delete handler
export function CheckInPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    checkInMember,
    filteredCheckIns,
    handleMemberChange,
    isCheckInPending,
    isDataLoading,
    isError,
    members,
    selectedMemberId,
    deleteCheckIn, // <-- Add this to your useCheckInPage hook
  } = useCheckInPage();

  if (isDataLoading) {
    return <LoadingAnimation />;
  }

  if (isError) {
    return <Typography>An error occurred</Typography>;
  }

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}
    >
      <Typography variant="h4" gutterBottom>
        Check-In System
      </Typography>
      <Box sx={{ mb: 2 }}>
        <SearchableMemberSelect
          selectedMemberId={selectedMemberId}
          onMemberChange={(memberId) =>
            handleMemberChange({
              target: { value: memberId },
            } as SelectChangeEvent)
          }
          members={members}
        />
        <Button
          variant="contained"
          onClick={checkInMember}
          disabled={isCheckInPending || !selectedMemberId}
          sx={{ mt: 2, width: '100%' }}
        >
          Check In
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <CheckInTable
          checkIns={filteredCheckIns}
          isMobile={isMobile}
          onDeleteCheckIn={deleteCheckIn}
        />
      </Box>
    </Box>
  );
}
