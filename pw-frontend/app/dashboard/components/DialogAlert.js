import React, { useState, Fragment } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from "@mui/material";

const DialogAlert = ({ title, onClose, onConfirm }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleConfirm = () => {
    setOpen(false);
    onConfirm(name);
    setName("");
  };

  return (
    <Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Category
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Category Name"
            type="text"
            fullWidth
            required={true}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Add</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default DialogAlert;
