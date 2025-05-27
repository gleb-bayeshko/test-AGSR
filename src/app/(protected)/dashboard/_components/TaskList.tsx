"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import { TiDeleteOutline } from "react-icons/ti";
import { TbEdit, TbPencilCancel, TbDeviceFloppy } from "react-icons/tb";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TaskList as TaskListProps } from "@/utils/types/api";
import Task from "./Task";
import ButtonWithIcon from "@/ui/ButtonWithIcon";
import { useDeleteTaskList } from "@/app/_queries/task-lists/useDeleteTaskList";
import { useAppDispatch } from "@/store/hooks";
import { stopPropagationForHandler } from "@/utils/common/stopPropagationForHandler";
import { openModalConfirmation } from "@/store/slices/modals/modalConfirmationSlice";
import { useEffect, useRef, useState } from "react";
import {
  hideLoadingOverlay,
  showLoadingOverlay,
} from "@/store/slices/loadingOverlaySlice";
import { pluralizeWord } from "@/utils/common/pluralizeWord";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateTaskList } from "@/app/_queries/task-lists/useUpdateTaskList";
import {
  TaskListUpdateForm,
  taskListUpdateSchema,
} from "@/utils/validations/taskListUpdateSchema";
import CreateTaskInListForm from "./CreateTaskInListForm";

export default function TaskList({
  id,
  tasks,
  title,
}: TaskListProps) {
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const { mutateAsync: deleteList, isPending: isDeleting } =
    useDeleteTaskList();
  const { mutateAsync: updateList, isPending: isUpdating } =
    useUpdateTaskList();

  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setFocus,
  } = useForm<TaskListUpdateForm>({
    defaultValues: { title },
    resolver: zodResolver(taskListUpdateSchema),
  });

  const isPending = isDeleting || isUpdating;

  const taskWord = pluralizeWord("задач", {
    one: "а",
    few: "и",
    many: "",
  });

  const onSubmit = async (data: TaskListUpdateForm) => {
    if (data.title === title) {
      setIsEditing(false);
      return;
    }

    await updateList({ id, title: data.title });
    setIsEditing(false);
  };

  const handleDelete = () => {
    dispatch(
      openModalConfirmation({
        text: `Вы точно хотите удалить список "${title}"?`,
        onConfirm: () => deleteList(id),
      })
    );
  };

  const handleEdit = stopPropagationForHandler(() => {
    setIsEditing(true);
  });

  const handleSave = stopPropagationForHandler(handleSubmit(onSubmit));

  const handleCancel = stopPropagationForHandler(() => {
    setIsEditing(false);
    reset({ title });
  });

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const nextFocused = e.relatedTarget;

    if (
      nextFocused === saveButtonRef.current ||
      nextFocused === cancelButtonRef.current
    ) {
      return;
    }
    handleCancel(e);
  };

  useEffect(() => {
    if (isPending) {
      dispatch(showLoadingOverlay());
    } else {
      dispatch(hideLoadingOverlay());
    }
  }, [dispatch, isPending]);

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => setFocus("title"), 0); // задержка для focus
    }
  }, [isEditing, setFocus]);

  return (
    <Accordion sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} component="div">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {isEditing ? (
              <TextField
                {...register("title")}
                inputRef={inputRef}
                error={!!errors.title}
                helperText={errors.title?.message}
                onBlur={onBlur}
                size="small"
                disabled={isPending}
              />
            ) : (
              <>
                <Typography fontWeight={600}>{title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {`${tasks.length} ${taskWord(tasks.length)}`}
                </Typography>
              </>
            )}
          </Box>

          <Box display="flex" columnGap={"5px"} marginRight={2}>
            {isEditing ? (
              <>
                <ButtonWithIcon
                  onClick={handleSave}
                  icon={<TbDeviceFloppy size={20} />}
                  color="success"
                  square
                  disabled={isPending}
                  ref={saveButtonRef}
                />
                <ButtonWithIcon
                  onClick={handleCancel}
                  icon={<TbPencilCancel size={20} />}
                  color="error"
                  square
                  disabled={isPending}
                  ref={cancelButtonRef}
                />
              </>
            ) : (
              <>
                <ButtonWithIcon
                  onClick={handleEdit}
                  icon={<TbEdit size={20} />}
                  color="warning"
                  square
                  disabled={isPending}
                />
                <ButtonWithIcon
                  onClick={stopPropagationForHandler(handleDelete)}
                  icon={<TiDeleteOutline size={20} />}
                  color="error"
                  square
                  disabled={isPending}
                />
              </>
            )}
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" gap={1} mt={2}>
          {tasks.map((task) => (
            <Task key={task.id} {...task} />
          ))}
        </Box>
        <CreateTaskInListForm listId={id} />
      </AccordionDetails>
    </Accordion>
  );
}
