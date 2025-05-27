import { z } from "zod";

export const taskListCreateSchema = z.object({
  title: z.string().min(1, "Введите название списка"),
});

export type TaskListCreateForm = z.infer<typeof taskListCreateSchema>;
