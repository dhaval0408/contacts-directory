import { useCallback, useEffect, useState } from "react";
import { IContact } from "../Interfaces/contact";
import contactService from "../Services/contact-service";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TextField,
  InputAdornment,
  TablePagination,
  Box,
  CircularProgress, // For loading indicator
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import SearchIcon from "@mui/icons-material/Search";
import { ISearch } from "../Interfaces/search";
import { IContactListResponse } from "../Interfaces/contactListResponse";
import AddIcon from "@mui/icons-material/Add";
import ContactFormDialog from "./ContactFormDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const headCells = [
  { id: "firstName", numeric: false, label: "First Name" },
  { id: "lastName", numeric: true, label: "Last Name" },
  { id: "email", numeric: false, label: "Email" },
  { id: "phoneNumber", numeric: false, label: "Phone" },
  { id: "dateOfBirth", numeric: false, label: "DOB" },
  { id: "actions", numeric: false, label: "Actions", sortable: false }, // Added for buttons
];

export default function ContactList() {
  const [contactList, setContactList] = useState<IContactListResponse>();
  const [contactRequest, setContactRequest] = useState<ISearch>({
    sortOrder: "asc",
    sortBy: "",
    keywordSearch: "",
    pageNo: 0,
    pageSize: 100,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // For delayed search
  const [totalRows, setTotalRows] = useState(0); // Total count from backend

  // Dialog state for Add/Edit
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // 'add' or 'edit'
  const [editingContact, setEditingContact] = useState<IContact | null>(); // User object being edited

  // Delete Confirmation Dialog state
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<IContact | null>(); // User object to be deleted

  const handleRequestSort = (property: string) => {
    // Prevent sorting on the 'actions' column
    if (property === "actions") return;

    const isAsc =
      contactRequest.sortBy === property && contactRequest.sortOrder === "asc";

    setContactRequest({
      ...contactRequest,
      sortOrder: isAsc ? "desc" : "asc",
      sortBy: property,
      pageNo: 0, // Reset to first page on new sort
    });
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setContactRequest({
      ...contactRequest,
      pageNo: newPage,
    });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setContactRequest({
      ...contactRequest,
      pageSize: parseInt(event.target.value, 10),
      pageNo: 0, // Reset to the first page when rows per page changes
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContactRequest({
      ...contactRequest,
      keywordSearch: event.target.value,
      pageNo: 0, // Reset to the first page when search keyword changes
    });
  };

  // --- Add/Edit Dialog Handlers ---
  const handleAddClick = () => {
    setDialogMode("add");
    setEditingContact(null); // Ensure no old data is present
    setOpenDialog(true);
  };

  const handleEditClick = (contact: IContact) => {
    setDialogMode("edit");
    setEditingContact(contact);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingContact(null);
  };

  const handleSubmitContact = async (contact: IContact) => {
    try {
      setLoading(true);
      if (dialogMode === "add") {
        await contactService.add(contact);
      } else if (dialogMode === "edit" && editingContact) {
        await contactService.update(editingContact.id, contact);
      }
      fetchData(); // Re-fetch data to update the table
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to save user.");
    } finally {
      setOpenDialog(false);
      setLoading(false);
    }
  };

  // --- Delete Handlers ---
  const handleDeleteClick = (contact: IContact) => {
    setContactToDelete(contact);
    setOpenConfirmDelete(true);
  };

  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false);
    setContactToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (contactToDelete) {
      try {
        setLoading(true);
        await contactService.deleteContact(contactToDelete.id);
        fetchData(); // Re-fetch data to update the table
      } catch (err) {
        console.error("Error deleting user:", err);
        setError("Failed to delete user.");
      } finally {
        setLoading(false);
        handleCloseConfirmDelete(); // Close confirmation dialog
      }
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // if we have debouncedSearchTerm then we will pass it to request and update in state as well
      const finalRequest = { ...contactRequest };
      if (debouncedSearchTerm) {
        const finalRequest = {
          ...contactRequest,
          keywordSearch: debouncedSearchTerm,
        };
        setContactRequest(finalRequest);
      }

      // Make API call
      const response = await contactService.getAll(finalRequest);

      // Set the response data in the state
      setContactList(response.data);
      setTotalRows(response.data.totalRows);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    contactRequest.pageNo,
    contactRequest.pageSize,
    contactRequest.sortOrder,
    contactRequest.sortBy,
    debouncedSearchTerm,
  ]); // Dependencies for fetchData

  // --- Debounce search term to prevent excessive API calls ---

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(contactRequest.keywordSearch);
    }, 500); // 500ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [contactRequest.keywordSearch]);

  // Trigger data fetch whenever relevant state changes
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Only re-run if fetchData function reference changes (due to its own dependencies)

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        {/* Search Bar */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search..."
            value={contactRequest.keywordSearch}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1, mr: 2 }}
          />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Add New User
          </Button>
        </Box>

        {/* Table Container */}
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            {/* Table Head */}
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? "right" : "left"}
                    sortDirection={
                      contactRequest.sortBy === headCell.id
                        ? contactRequest.sortOrder
                        : false
                    }
                  >
                    <TableSortLabel
                      active={contactRequest.sortBy === headCell.id}
                      direction={
                        contactRequest.sortBy === headCell.id
                          ? contactRequest.sortOrder
                          : "asc"
                      }
                      onClick={() => handleRequestSort(headCell.id)}
                    >
                      {headCell.label}
                      {contactRequest.sortBy === headCell.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {contactRequest.sortOrder === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={headCells.length} align="center">
                    <CircularProgress sx={{ my: 4 }} />
                    <Typography>Loading data...</Typography>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={headCells.length} align="center">
                    <Typography color="error">{error}</Typography>
                  </TableCell>
                </TableRow>
              ) : contactList?.totalRows === 0 ? (
                <TableRow>
                  <TableCell colSpan={headCells.length} align="center">
                    No data available.{" "}
                    {contactRequest.keywordSearch &&
                      "Try a different search term."}
                  </TableCell>
                </TableRow>
              ) : (
                contactList?.contacts.map((contact: IContact) => (
                  <TableRow hover tabIndex={-1} key={contact.id}>
                    <TableCell component="th" scope="row">
                      {contact.firstName}
                    </TableCell>
                    <TableCell align="right">{contact.lastName}</TableCell>
                    <TableCell align="left">{contact.email}</TableCell>
                    <TableCell align="left">{contact.phoneNumber}</TableCell>
                    <TableCell align="left">
                      {new Date(contact.dateOfBirth).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditClick(contact)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteClick(contact)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Table Pagination */}
        <TablePagination
          rowsPerPageOptions={[100, 200, 500, 1000]}
          component="div"
          count={totalRows}
          rowsPerPage={contactRequest.pageSize}
          page={contactRequest.pageNo}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Add/Edit User Dialog */}
      <ContactFormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitContact}
        mode={dialogMode}
        initialData={editingContact}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openConfirmDelete}
        onClose={handleCloseConfirmDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete user "{contactToDelete?.firstName}{" "}
            {contactToDelete?.lastName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDelete} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
