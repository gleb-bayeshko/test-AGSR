"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { IoAddCircleOutline } from "react-icons/io5";
import { useTaskLists } from "@/app/_queries/task-lists/useTaskLists";
import { useCreateTaskList } from "@/app/_queries/task-lists/useCreateTaskList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch } from "@/store/hooks";
import { openModalAddTaskList } from "@/store/slices/modals/modalAddTaskListSlice";
import { useDeleteTaskList } from "@/app/_queries/task-lists/useDeleteTaskList";
import TaskList from "./TaskList";

export default function TaskLists() {
  const { data: taskLists, isLoading, refetch } = useTaskLists();

  const isEmpty = taskLists?.length === 0;

  return (
    <>
      {isEmpty ? (
        <Box textAlign="center" mt={8}>
          <Typography variant="h6" gutterBottom>
            Список задач пуст
          </Typography>
        </Box>
      ) : (
        taskLists?.map((list) => <TaskList key={list.id} {...list} />)
      )}
    </>
  );
}
