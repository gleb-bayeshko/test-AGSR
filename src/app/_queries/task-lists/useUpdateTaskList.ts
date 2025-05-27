import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { ApiResponse } from "@/utils/api/apiResponse";
import { TaskList } from "@/utils/types/api";

export interface UpdateTaskListDto {
  id: number;
  title: string;
}

export type UpdatedTaskList = TaskList;

export function useUpdateTaskList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, title }: UpdateTaskListDto) =>
      apiClient.put<ApiResponse<UpdatedTaskList>, { title: string }>(
        `/api/task-lists/${id}`,
        { title },
        { auth: true }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskLists"] });
    },
  });
}
