import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().nonempty("Введите email").email("Неверный email"),
  password: z.string().min(3, "Минимум 3 символа"),
});

export type LoginForm = z.infer<typeof loginSchema>;
