// Add to imports
import DeleteIcon from '@mui/icons-material/Delete';
import { CheckIn } from './check-in.model';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { format, isAfter, isEqual, parseISO, addMonths } from 'date-fns';
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  IconButton,
  Paper,
  SelectChangeEvent,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useCheckInPage } from './use-check-in-page';
import { LoadingAnimation } from '@/components';
import { Member } from '../member';
import { useEffect, useState } from 'react';
import { useSnackbar } from '@/context';

// In CheckInTable props, add onDeleteCheckIn
interface SearchableMemberSelectProps {
  selectedMemberId: string;
  onMemberChange: (memberId: string) => void;
  members: Member[];
  checkInMember: () => void;
}

export const SearchableMemberSelect: React.FC<SearchableMemberSelectProps> = ({
  selectedMemberId,
  onMemberChange,
  members,
  checkInMember,
}) => {
  const { showSnackbar } = useSnackbar();
  const handleChange = (_: React.SyntheticEvent, value: Member | null) => {
    if (value) {
      onMemberChange(value.id);
    }
  };

  const handlekeypress = (e: React.SyntheticEvent) => {
    if (e.key === 'Enter') {
      if (selectedMemberId) checkInMember();
      else
        showSnackbar('Member required which maybe empty or not exist', 'error');
    }
  };

  return (
    <FormControl fullWidth>
      <Autocomplete
        id="member-select-autocomplete"
        options={members}
        getOptionLabel={(option) => `${option.serial}`}
        renderInput={(params) => (
          <TextField {...params} label="Select Member" />
        )}
        value={members.find((member) => member.id === selectedMemberId) || null}
        onChange={handleChange}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onKeyDown={handlekeypress}
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
      valueGetter: (_, row) => format(parseISO(row.createdAt), 'dd MMMM yyy'),
    },
    {
      field: 'time',
      headerName: 'Time',
      width: 110,
      flex: 1,
      valueGetter: (_, row) => format(parseISO(row.createdAt ?? ''), 'hh:mm a'),
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
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      flex: 1,
      renderCell: (params) => (
        <div
          style={{ color: params.row.status === false ? "rgb(5, 220, 20)" : "#ffd900" }}
        >
          {params.row.status === false ? 'Active' : 'Expired'}
        </div>
      ),
    },
  ];

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
          overflowY: "auto"
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
  const [checkIns, setCheckIns] = useState<any>(null);

  function isAfterOrEqual(dateToCompare: any) {
    const date = Date.now();
    return isAfter(date, dateToCompare) || isEqual(date, dateToCompare);
  }

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

  useEffect(() => {
    let data: any = [];
    if (filteredCheckIns?.length > 0) {
      async function fetchData() {
        for (const filteredCheckIn of filteredCheckIns) {
          const payments: any = await window.api.payments.find({
            memberId: filteredCheckIn?.memberId,
          });
          data = [
            ...data,
            {
              ...filteredCheckIn,
              status: isAfterOrEqual(addMonths(payments?.[0].createdAt, 1)),
            },
          ];
        }
        if (data.length === filteredCheckIns.length) return data;
      }
      fetchData().then((res) => setCheckIns(res));
    }

    if (filteredCheckIns.length === data.length) setCheckIns(data);
  }, [filteredCheckIns]);

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
          checkInMember={checkInMember}
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
          checkIns={checkIns}
          isMobile={isMobile}
          onDeleteCheckIn={deleteCheckIn}
        />
      </Box>
    </Box>
  );
}
