"use client";

import {
  Box,
  Chip,
  Stack,
  Typography,
  Popover,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Task as TaskProps, TaskStatus } from "@/utils/types/api";
import { useUpdateTask } from "@/app/_queries/tasks/useUpdateTask";
import { useDeleteTask } from "@/app/_queries/tasks/useDeleteTask";
import { TbEye, TbEdit, TbDeviceFloppy, TbPencilCancel } from "react-icons/tb";
import { TiDeleteOutline } from "react-icons/ti";
import StatusSelector from "./StatusSelector";
import ButtonWithIcon from "@/ui/ButtonWithIcon";
import { DeadlineStatus, useDeadlineTimer } from "@/hooks/useDeadlineTimer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { stopPropagationForHandler } from "@/utils/common/stopPropagationForHandler";
import {
  EditTaskInLineForm,
  editTaskInLineSchema,
} from "@/utils/validations/editTaskInLineSchema";
import { useAppDispatch } from "@/store/hooks";
import { openModalTaskInfo } from "@/store/slices/modals/modalTaskInfoSlice";

export default function Task({
  createdAt,
  dueAt,
  id,
  status,
  title,
  description,
  listId,
  updatedAt,
}: TaskProps) {
  const dispatch = useAppDispatch();
  const {
    mutate: updateTask,
    mutateAsync: updateTaskAsync,
    isPending: isUpdating,
  } = useUpdateTask();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
  const [timerData, startTimer] = useDeadlineTimer();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<EditTaskInLineForm>({
    defaultValues: { title },
    resolver: zodResolver(editTaskInLineSchema),
  });

  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!dueAt || status === TaskStatus.DONE) return;
    startTimer(dueAt);
  }, [dueAt, status, startTimer]);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    dueAt ? new Date(dueAt) : null
  );

  const handleChipClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDateSelect = (newDate: Date | null) => {
    if (newDate) {
      setSelectedDate(newDate);
      updateTask({ id, dueAt: newDate.toISOString() });
    }
    setAnchorEl(null);
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (newStatus !== status) {
      updateTask({ id, status: newStatus });
    }
  };

  const handleDelete = () => deleteTask(id);

  const handleEdit = stopPropagationForHandler(() => {
    setIsEditing(true);
  });

  const onSubmit = async (data: EditTaskInLineForm) => {
    if (data.title === title) {
      setIsEditing(false);
      return;
    }

    await updateTask({ id, title: data.title });
    setIsEditing(false);
  };

  const handleSave = stopPropagationForHandler(handleSubmit(onSubmit));

  const handleCancel = stopPropagationForHandler(() => {
    reset({ title });
    setIsEditing(false);
  });

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const nextFocused = e.relatedTarget;
    if (
      nextFocused === saveButtonRef.current ||
      nextFocused === cancelButtonRef.current
    )
      return;
    handleCancel(e);
  };

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => setFocus("title"), 0);
    }
  }, [isEditing, setFocus]);

  const open = Boolean(anchorEl);

  const handleOpenModal = stopPropagationForHandler(() => {
    dispatch(
      openModalTaskInfo({
        data: {
          id,
          title,
          description,
          status,
          dueAt,
          createdAt,
          updatedAt,
          listId,
        },
        onEdit: async (updatedTask) => {
          await updateTaskAsync(updatedTask);
          // @ts-expect-error its fine
          dispatch(openModalTaskInfo({ data: updatedTask }));
        },
        onCancel: () => reset({ title }),
      })
    );
  });

  return (
    <Box
      p={2}
      borderRadius={1}
      bgcolor="#fdfdfd"
      boxShadow="0 1px 4px rgba(0, 0, 0, 0.05)"
      sx={{
        transition: "box-shadow 0.2s ease, transform 0.1s ease",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          transform: "translateY(-2px)",
        },
        position: "relative",
      }}
    >
      {(isUpdating || isDeleting) && (
        <Box
          position="absolute"
          borderRadius={1}
          top={0}
          left={0}
          width="100%"
          height="100%"
          bgcolor="#FFFFFF85"
          zIndex={20}
        />
      )}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1}
      >
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {isEditing ? (
            <TextField
              {...register("title")}
              size="small"
              error={!!errors.title}
              helperText={errors.title?.message}
              onBlur={onBlur}
              disabled={isUpdating}
            />
          ) : (
            <Typography
              fontWeight={600}
              fontSize="14px"
              sx={{
                textDecoration:
                  status === TaskStatus.DONE ? "line-through" : "none",
                cursor: "pointer",
              }}
              onClick={handleOpenModal}
            >
              {title}
            </Typography>
          )}
        </Box>

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          justifyContent={{ xs: "flex-start", sm: "flex-end" }}
        >
          {!isEditing && (
            <>
              <StatusSelector
                currentStatus={status}
                onChange={handleStatusChange}
              />

              {status !== TaskStatus.DONE && (
                <>
                  <Chip
                    size="small"
                    label={
                      timerData.status === DeadlineStatus.EXPIRED
                        ? "Просрочено"
                        : `Осталось: ${timerData.label}`
                    }
                    color={timerData.color}
                    onClick={handleChipClick}
                  />
                  <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  >
                    <DateCalendar
                      disablePast
                      value={selectedDate}
                      onChange={handleDateSelect}
                    />
                  </Popover>
                </>
              )}
            </>
          )}

          <Box display="flex" columnGap="5px">
            {isEditing ? (
              <>
                <ButtonWithIcon
                  icon={<TbDeviceFloppy />}
                  color="success"
                  square
                  onClick={handleSave}
                  ref={saveButtonRef}
                />
                <ButtonWithIcon
                  icon={<TbPencilCancel />}
                  color="error"
                  square
                  onClick={handleCancel}
                  ref={cancelButtonRef}
                />
              </>
            ) : (
              <>
                <ButtonWithIcon
                  icon={<TbEdit />}
                  color="warning"
                  square
                  onClick={handleEdit}
                />
                <ButtonWithIcon
                  icon={<TiDeleteOutline />}
                  color="error"
                  square
                  onClick={handleDelete}
                />
                <ButtonWithIcon
                  icon={<TbEye />}
                  square
                  onClick={handleOpenModal}
                />
              </>
            )}
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
