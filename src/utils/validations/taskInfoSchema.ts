import { z } from "zod";
import { TaskStatus } from "@/utils/types/api";

export const taskInfoSchema = z.object({
  title: z.string().min(1, "Введите название"),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus),
  dueAt: z.date().nullable(),
});

export type TaskInfoFormValues = z.infer<typeof taskInfoSchema>;
