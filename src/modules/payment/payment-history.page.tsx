import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { format, parseISO } from 'date-fns';
import { IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

export function PaymentHistory() {
  const [rows, setRows] = useState<any[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRow, setEditRow] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const payments = await window.api.payments.find({});
      const dataRow = [];
      for (const payment of payments) {
        const member = await window.api.members.find({ id: payment.memberId });
        const plan = await window.api.plans.find({ id: payment.planId });
        dataRow.push({
          ...payment,
          member_name: `${member?.[0]?.firstName} ${member?.[0]?.lastName}`,
          phone: member?.[0]?.phone,
          plan_name: plan?.[0]?.name,
          amount: plan?.[0]?.price,
          status: payment.status || 'Paid', // Default status
        });
      }
      setRows(dataRow);
    }
    fetchData();
  }, []);

  // Edit dialog handlers
  const handleOpenDialog = (row: any) => {
    setEditRow(row);
    setEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setEditRow(null);
  };

  const handleEditSave = async () => {
    if (editRow) {
      await window.api.payments.update(editRow.id, editRow);
      setRows(rows.map(r => (r.id === editRow.id ? editRow : r)));
      handleCloseDialog();
    }
  };

  // Delete handler
  const handleDeletePayment = async (id: any) => {
    await window.api.payments.remove(id);
    setRows(rows.filter(r => r.id !== id));
  };

  const columns = [
    { field: 'member_name', headerName: 'Name', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'plan_name', headerName: 'Membership Plan', flex: 1 },
    { field: 'amount', headerName: 'Amount', flex: 1 },
    {
      field: 'createdAt',
      headerName: 'Date',
      valueGetter: (_: any, row: any) =>
        format(parseISO(row.createdAt), 'dd MMMM yyyy'),
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      flex: 1,
      sortable: false,
      renderCell: (params: any) => (
        <>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => handleOpenDialog(params.row)}
              size="small"
              sx={{ color: 'white' }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => handleDeletePayment(params.row.id)}
              size="small"
              sx={{ color: 'white' }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
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
          mt: 3,
        }}
        autoHeight
      />

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Edit Payment</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            value={editRow?.amount || ''}
            onChange={e => setEditRow({ ...editRow, amount: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Status"
            fullWidth
            value={editRow?.status || ''}
            onChange={e => setEditRow({ ...editRow, status: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
