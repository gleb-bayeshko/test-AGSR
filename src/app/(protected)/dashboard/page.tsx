"use client";

import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { IoAddCircleOutline } from "react-icons/io5";
import { useTaskLists } from "@/app/_queries/task-lists/useTaskLists";
import { useCreateTaskList } from "@/app/_queries/task-lists/useCreateTaskList";
import { useAppDispatch } from "@/store/hooks";
import { openModalAddTaskList } from "@/store/slices/modals/modalAddTaskListSlice";
import TaskLists from "./_components/TaskLists";
import { useEffect } from "react";
import { hideLoadingOverlay, showLoadingOverlay } from "@/store/slices/loadingOverlaySlice";

export default function DashboardPage() {
  const { isLoading } = useTaskLists();
  const { isPending: isCreating } = useCreateTaskList();

  const dispatch = useAppDispatch();

  const handleCreate = async () => {
    dispatch(openModalAddTaskList());
  };

  useEffect(() => {
    if (isLoading) {
      dispatch(showLoadingOverlay());
    } else {
      dispatch(hideLoadingOverlay());
    }
  }, [dispatch, isLoading]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" component="h1">
          Списки задач
        </Typography>
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={isCreating}
          startIcon={<IoAddCircleOutline />}
        >
          Добавить список задач
        </Button>
      </Box>

      <TaskLists />
    </Box>
  );
}
