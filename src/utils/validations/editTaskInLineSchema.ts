import { z } from "zod";

export const editTaskInLineSchema = z.object({
  title: z.string().min(1, "Введите название задачи"),
});

export type EditTaskInLineForm = z.infer<typeof editTaskInLineSchema>;

