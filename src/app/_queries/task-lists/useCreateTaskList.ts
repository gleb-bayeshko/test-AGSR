import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { ApiResponse } from "@/utils/api/apiResponse";
import { TaskList } from "@/utils/types/api";

export interface CreateTaskListDto {
  title: string;
}

export type CreatedTaskList = Omit<TaskList, "tasks">;

export function useCreateTaskList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskListDto) =>
      apiClient.post<ApiResponse<CreatedTaskList>, CreateTaskListDto>(
        "/api/task-lists",
        data,
        { auth: true }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskLists"] });
    },
  });
}
