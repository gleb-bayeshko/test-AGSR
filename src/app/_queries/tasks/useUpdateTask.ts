import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { ApiResponse } from "@/utils/api/apiResponse";
import { Task, TaskStatus } from "@/utils/types/api";

export interface UpdateTaskDto {
  id: number;
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  dueAt?: string | null; // ISO-строка
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: UpdateTaskDto) =>
      apiClient.put<ApiResponse<Task>, Omit<UpdateTaskDto, "id">>(
        `/api/tasks/${id}`,
        data,
        {
          auth: true,
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskLists"] });
    },
  });
}
