import { z } from "zod";

export const taskListUpdateSchema = z.object({
  title: z.string().min(1, "Введите название"),
});

export type TaskListUpdateForm = z.infer<typeof taskListUpdateSchema>;