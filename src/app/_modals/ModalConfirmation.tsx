"use client";

import { Button, Stack, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import BaseModal from "./BaseModal";
import { closeModalConfirmation } from "@/store/slices/modals/modalConfirmationSlice";

export default function ModalConfirmation() {
  const dispatch = useAppDispatch();
  const { isOpen, text, onConfirm, onCancel } = useAppSelector(
    (state) => state.modalConfirmation
  );

  const handleClose = () => {
    dispatch(closeModalConfirmation());
    onCancel?.(); 
  };

  const handleConfirm = () => {
    dispatch(closeModalConfirmation());
    onConfirm?.(); 
  };

  return (
    <BaseModal open={isOpen} onClose={handleClose} title="Подтверждение">
      <Stack spacing={3}>
        <Typography>{text}</Typography>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={handleClose} variant="outlined" color="warning">
            Нет
          </Button>
          <Button onClick={handleConfirm} variant="contained" color="error">
            Да
          </Button>
        </Stack>
      </Stack>
    </BaseModal>
  );
}
