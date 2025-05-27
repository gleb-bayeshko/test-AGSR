import { useCallback, useEffect, useRef, useState } from "react";
import {
  differenceInMonths,
  differenceInDays,
  differenceInSeconds,
  isPast,
  parseISO,
  intervalToDuration,
} from "date-fns";

export enum DeadlineStatus {
  NOT_SET = "NOT_SET",
  IN_PROGRESS = "IN_PROGRESS",
  EXPIRED = "EXPIRED",
}

type TimerData = {
  label: string;
  color: "default" | "error";
  status: DeadlineStatus;
};

export function useDeadlineTimer(): [
  TimerData,
  (dueAt: string | null) => void
] {
  const [timerData, setTimerData] = useState<TimerData>({
    label: "--:--",
    color: "default",
    status: DeadlineStatus.NOT_SET,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const formatTime = (totalSeconds: number): string => {
    const duration = intervalToDuration({
      start: 0,
      end: totalSeconds * 1000,
    });

    const { hours = 0, minutes = 0, seconds = 0 } = duration;

    const pad = (n: number) => n.toString().padStart(2, "0");

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const calculate = useCallback((dueAt: string | null): TimerData => {
    if (!dueAt) {
      return {
        label: "--:--",
        color: "default",
        status: DeadlineStatus.NOT_SET,
      };
    }

    const due = parseISO(dueAt);
    const now = new Date();

    if (isPast(due)) {
      return {
        label: "Просрочено",
        color: "error",
        status: DeadlineStatus.EXPIRED,
      };
    }

    const months = differenceInMonths(due, now);
    if (months >= 1) {
      return {
        label: `${months} мес.`,
        color: "default",
        status: DeadlineStatus.IN_PROGRESS,
      };
    }

    const days = differenceInDays(due, now);
    if (days >= 1) {
      return {
        label: `${days} дн.`,
        color: "default",
        status: DeadlineStatus.IN_PROGRESS,
      };
    }

    const seconds = differenceInSeconds(due, now);
    return {
      label: formatTime(seconds),
      color: "default",
      status: DeadlineStatus.IN_PROGRESS,
    };
  }, []);

  const start = useCallback(
    (dueAt: string | null) => {
      clear();

      if (!dueAt) {
        setTimerData({
          label: "--:--",
          color: "default",
          status: DeadlineStatus.NOT_SET,
        });
        return;
      }

      const due = parseISO(dueAt);
      const initial = calculate(dueAt);
      setTimerData(initial);

      if (initial.status === DeadlineStatus.EXPIRED) return;

      if (differenceInDays(due, new Date()) < 1) {
        intervalRef.current = setInterval(() => {
          const next = calculate(dueAt);
          setTimerData(next);

          if (next.status === DeadlineStatus.EXPIRED) {
            clear();
          }
        }, 1000);
      }
    },
    [calculate]
  );

  useEffect(() => clear, []);

  return [timerData, start];
}
