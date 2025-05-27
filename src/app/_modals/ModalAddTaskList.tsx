"use client";

import { useRef } from "react";
import { Button, TextField, Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import BaseModal from "./BaseModal";
import { useCreateTaskList } from "../_queries/task-lists/useCreateTaskList";
import { closeModalAddTaskList } from "@/store/slices/modals/modalAddTaskListSlice";
import { enqueueSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  taskListCreateSchema,
  TaskListCreateForm,
} from "@/utils/validations/taskListCreateSchema";

export function ModalAddTaskList() {
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.modalAddTaskList.isOpen);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskListCreateForm>({
    resolver: zodResolver(taskListCreateSchema),
  });

  const { mutate, isPending } = useCreateTaskList();

  const onSubmit = (data: TaskListCreateForm) => {
    mutate(data, {
      onSuccess: () => {
        enqueueSnackbar(`Список задач "${data.title}" успешно создан`, {
          variant: "success",
        });
        dispatch(closeModalAddTaskList());
        reset();
      },
    });
  };

  const handleClose = () => {
    dispatch(closeModalAddTaskList());
    reset();
  };

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title="Создать список задач"
      onEntered={() => inputRef.current?.focus()}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Название списка"
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
            disabled={isPending}
            inputRef={inputRef}
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              onClick={handleClose}
              variant="contained"
              color="warning"
              type="button"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              variant="contained"
              color="success"
            >
              Создать
            </Button>
          </Stack>
        </Stack>
      </form>
    </BaseModal>
  );
}
