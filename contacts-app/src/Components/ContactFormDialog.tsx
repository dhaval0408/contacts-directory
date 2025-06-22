import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { IContact } from "../Interfaces/contact";
import { useForm } from "react-hook-form";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: IContact) => Promise<void>;
  mode: string;
  initialData: IContact | null | undefined;
};
export default function ContactFormDialog({
  open,
  onClose,
  onSubmit,
  mode,
  initialData,
}: Props) {
  const [formData, setFormData] = useState<IContact>({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: new Date(),
    phoneNumber: "",
    contactAddress: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  const {
    register,

    formState: { errors },
  } = useForm<IContact>();

  // Effect to update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        id: initialData.id || 0,
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        dateOfBirth: initialData.dateOfBirth || new Date(),
        phoneNumber: initialData.phoneNumber || "",
        contactAddress: {
          street: initialData.contactAddress.street || "",
          city: initialData.contactAddress.city || "",
          state: initialData.contactAddress.state || "",
          postalCode: initialData.contactAddress.postalCode || "",
          country: initialData.contactAddress.country || "",
        },
      });
    } else {
      // Reset form for 'add' mode when dialog opens
      setFormData({
        id: 0,
        firstName: "",
        lastName: "",
        email: "",
        dateOfBirth: new Date(),
        phoneNumber: "",
        contactAddress: {
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        },
      });
    }
  }, [mode, initialData, open]); // Include 'open' in dependency array to reset when dialog becomes open

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === "add" ? "Add New User" : "Edit User"}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={() => onSubmit(formData)} sx={{ mt: 2 }}>
          <TextField
            {...register("firstName", { required: "First name is required" })}
            autoFocus
            margin="dense"
            label="First Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.firstName}
            onChange={handleChange} // Handle direct field change
          />
          {errors.firstName && <p>{errors.firstName.message}</p>}
          <TextField
            {...register("lastName", { required: "Last name is required" })}
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <p>{errors.lastName.message}</p>}
          <TextField
            {...register("email", { required: "Email is required" })}
            margin="dense"
            label="Email"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p>{errors.email.message}</p>}

          <TextField
            {...register("phoneNumber")}
            margin="dense"
            label="Phone Number"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={() => onSubmit(formData)}
          variant="contained"
          color="primary"
        >
          {mode === "add" ? "Add" : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
