import { z } from "zod";

export const createTaskInListSchema = z.object({
  title: z.string().min(1, "Введите название задачи"),
});

export type CreateTaskInListForm = z.infer<typeof createTaskInListSchema>;
