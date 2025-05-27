"use client";

import {
  Box,
  Button,
  Chip,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import BaseModal from "./BaseModal";
import { closeModalTaskInfo } from "@/store/slices/modals/modalTaskInfoSlice";
import { useEffect, useState } from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useDeadlineTimer, DeadlineStatus } from "@/hooks/useDeadlineTimer";
import { TaskStatus } from "@/utils/types/api";
import { format } from "date-fns";
import StatusSelector, {
  statusMap,
} from "../(protected)/dashboard/_components/StatusSelector";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  taskInfoSchema,
  TaskInfoFormValues,
} from "@/utils/validations/taskInfoSchema";

export default function ModalTaskInfo() {
  const dispatch = useAppDispatch();
  const { isOpen, data, onCancel, onEdit, isLoading } = useAppSelector(
    (state) => state.modalTaskInfo
  );

  const [isEditing, setIsEditing] = useState(false);
  const [timerData, startTimer] = useDeadlineTimer();
  const [initialDueAt, setInitialDueAt] = useState<Date | null>(null);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openPopover = Boolean(anchorEl);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TaskInfoFormValues>({
    resolver: zodResolver(taskInfoSchema),
    defaultValues: {
      title: data?.title || "",
      description: data?.description || "",
      status: data?.status || TaskStatus.PENDING,
      dueAt: data?.dueAt ? new Date(data.dueAt) : null,
    },
  });

  const dueAtWatched = watch("dueAt");

  useEffect(() => {
    if (data) {
      reset({
        title: data.title,
        description: data.description || "",
        status: data.status,
        dueAt: data.dueAt ? new Date(data.dueAt) : null,
      });
    }
  }, [data, reset]);

  useEffect(() => {
    if (data) {
      setInitialDueAt(data.dueAt ? new Date(data.dueAt) : null);
    }
  }, [data]);

  useEffect(() => {
    if (!isEditing && initialDueAt) startTimer(initialDueAt.toISOString());
  }, [data, initialDueAt, isEditing, startTimer]);

  useEffect(() => {
    if (dueAtWatched) startTimer(dueAtWatched.toISOString());
  }, [dueAtWatched, startTimer]);

  const handleClose = () => {
    setIsEditing(false);
    dispatch(closeModalTaskInfo());
    onCancel?.();
  };

  const onSubmit = (values: TaskInfoFormValues) => {
    onEdit?.({
      ...data,
      ...values,
      dueAt: values.dueAt?.toISOString() || null,
    });
    setIsEditing(false);
  };

  return (
    <BaseModal
      open={isOpen}
      isLoading={isLoading}
      onClose={handleClose}
      title="Информация о задаче"
    >
      {data && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Stack spacing={2}>
              {isEditing ? (
                <>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Название"
                        fullWidth
                        error={!!errors.title}
                        helperText={errors.title?.message}
                      />
                    )}
                  />

                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Описание"
                        multiline
                        rows={4}
                        fullWidth
                      />
                    )}
                  />
                </>
              ) : (
                <>
                  <Box display="flex" flexDirection="column">
                    <Typography variant="body1">Название:</Typography>
                    <Typography variant="h6">{data.title}</Typography>
                  </Box>
                  <Box display="flex" flexDirection="column">
                    <Typography variant="body1">Описание:</Typography>
                    <Typography>{data.description}</Typography>
                  </Box>
                </>
              )}

              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Статус:</Typography>
                {isEditing ? (
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <StatusSelector
                        currentStatus={field.value}
                        onChange={(val) => field.onChange(val)}
                      />
                    )}
                  />
                ) : (
                  <Chip
                    label={statusMap[data.status].label}
                    color={statusMap[data.status].color}
                    size="small"
                  />
                )}
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Дедлайн:</Typography>
                {data.status !== TaskStatus.DONE && (
                  <>
                    <Controller
                      name="dueAt"
                      control={control}
                      render={() => (
                        <Chip
                          label={
                            timerData.status === DeadlineStatus.EXPIRED
                              ? "Просрочено"
                              : `Осталось: ${timerData.label}`
                          }
                          color={timerData.color}
                          onClick={
                            isEditing
                              ? (e) => setAnchorEl(e.currentTarget)
                              : undefined
                          }
                          size="small"
                        />
                      )}
                    />
                    <Popover
                      open={openPopover}
                      anchorEl={anchorEl}
                      onClose={() => setAnchorEl(null)}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                    >
                      <DateCalendar
                        disablePast
                        value={dueAtWatched}
                        onChange={(date) => {
                          setValue("dueAt", date);
                          setAnchorEl(null);
                        }}
                      />
                    </Popover>
                  </>
                )}
              </Stack>

              <Typography variant="body2" color="text.secondary">
                Создано:{" "}
                {format(new Date(data.createdAt), "dd.MM.yyyy - HH:mm")}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ marginTop: "6px!important" }}
              >
                Обновлено:{" "}
                {format(new Date(data.updatedAt), "dd.MM.yyyy - HH:mm")}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} justifyContent="flex-end">
              {isEditing ? (
                <>
                  <Button
                    color="error"
                    type="button"
                    variant="contained"
                    onClick={() => {
                      reset();
                      setIsEditing(false);
                    }}
                  >
                    Отменить
                  </Button>

                  <Button color="success" type="submit" variant="contained">
                    Сохранить
                  </Button>
                </>
              ) : (
                <Button
                  color="warning"
                  type="button"
                  variant="contained"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditing(true);
                  }}
                >
                  Редактировать
                </Button>
              )}
            </Stack>
          </Stack>
        </form>
      )}
    </BaseModal>
  );
}
