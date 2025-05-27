import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { ApiResponse } from "@/utils/api/apiResponse";
import { Task, TaskStatus } from "@/utils/types/api";

export interface CreateTaskDto {
  title: string;
  listId: number;
  description?: string;
  status?: TaskStatus;
  dueAt?: string; // ISO-строка
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskDto) =>
      apiClient.post<ApiResponse<Task>, CreateTaskDto>("/api/tasks", data, {
        auth: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskLists"] });
    },
  });
}
