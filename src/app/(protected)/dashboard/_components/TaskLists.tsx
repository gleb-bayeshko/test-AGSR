"use client";

import {
  Box,
  Typography,
} from "@mui/material";
import { useTaskLists } from "@/app/_queries/task-lists/useTaskLists";
import TaskList from "./TaskList";

export default function TaskLists() {
  const { data: taskLists } = useTaskLists();

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
