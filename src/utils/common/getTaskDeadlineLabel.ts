import {
  isBefore,
  differenceInDays,
  differenceInMonths,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";

// 
export function getTaskDeadlineLabel(dueAt: string | null): {
  label: string;
  color: "default" | "success" | "error";
} {
  if (!dueAt) return { label: "--:--", color: "default" };

  const due = new Date(dueAt);
  const now = new Date();

  if (isBefore(due, now)) {
    return { label: "Просрочено", color: "error" };
  }

  const months = differenceInMonths(due, now);
  if (months >= 1) {
    return { label: `${months} мес.`, color: "success" };
  }

  const days = differenceInDays(due, now);
  if (days >= 2) {
    return { label: `${days} дн.`, color: "success" };
  }

  const minutes = differenceInMinutes(due, now);
  if (minutes >= 1) {
    const seconds = differenceInSeconds(due, now) % 60;
    const pad = (v: number) => v.toString().padStart(2, "0");
    return { label: `${pad(minutes)}:${pad(seconds)}`, color: "success" };
  }

  return { label: "<1 мин", color: "success" };
}
