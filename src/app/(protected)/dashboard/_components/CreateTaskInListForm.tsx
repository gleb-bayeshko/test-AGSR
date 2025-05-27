"use client";

import { Box, Button, TextField } from "@mui/material";
import { TbDeviceFloppy, TbPencilCancel } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useRef } from "react";
import { stopPropagationForHandler } from "@/utils/common/stopPropagationForHandler";
import { useAppDispatch } from "@/store/hooks";
import {
  showLoadingOverlay,
  hideLoadingOverlay,
} from "@/store/slices/loadingOverlaySlice";
import { useCreateTask } from "@/app/_queries/tasks/useCreateTask";
import {
  createTaskInListSchema,
  CreateTaskInListForm as FormFields,
} from "@/utils/validations/createTaskInListSchema";

interface CreateTaskInListFormProps {
  listId: number;
}

export default function CreateTaskInListForm({
  listId,
}: CreateTaskInListFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const saveRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const dispatch = useAppDispatch();
  const { mutateAsync: createTask, isPending } = useCreateTask();

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(createTaskInListSchema),
  });

  const onSubmit = async (data: FormFields) => {
    await createTask({ listId, title: data.title });
    reset();
    setIsCreating(false);
  };

  const handleCancel = stopPropagationForHandler(() => {
    reset();
    setIsCreating(false);
  });

  const handleSave = stopPropagationForHandler(handleSubmit(onSubmit));

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const next = e.relatedTarget;
    if (next === saveRef.current || next === cancelRef.current) return;
    handleCancel(e);
  };

  useEffect(() => {
    if (isPending) {
      dispatch(showLoadingOverlay());
    } else {
      dispatch(hideLoadingOverlay());
    }
  }, [isPending, dispatch]);

  useEffect(() => {
    if (isCreating) {
      setTimeout(() => setFocus("title"), 0);
    }
  }, [isCreating, setFocus]);

  return (
    <Box mt={1}>
      {isCreating ? (
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          display="flex"
          gap={1}
        >
          <TextField
            {...register("title")}
            inputRef={inputRef}
            onBlur={onBlur}
            error={!!errors.title}
            helperText={errors.title?.message}
            size="small"
            fullWidth
            disabled={isPending}
          />
          <Button
            onClick={handleSave}
            variant="contained"
            color="success"
            ref={saveRef}
            disabled={isPending}
            sx={{ minWidth: 30, maxHeight: 40 }}
          >
            <TbDeviceFloppy size={20} />
          </Button>
          <Button
            onClick={handleCancel}
            variant="contained"
            color="error"
            ref={cancelRef}
            disabled={isPending}
            sx={{ minWidth: 30, maxHeight: 40 }}
          >
            <TbPencilCancel size={20} />
          </Button>
        </Box>
      ) : (
        <Button
          variant="outlined"
          size="small"
          onClick={() => setIsCreating(true)}
          disabled={isPending}
        >
          Добавить задачу
        </Button>
      )}
    </Box>
  );
}
