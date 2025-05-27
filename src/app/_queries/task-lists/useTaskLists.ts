import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { ApiResponse } from "@/utils/api/apiResponse";
import { TaskList } from "@/utils/types/api";

export function useTaskLists() {
  return useQuery({
    queryKey: ["taskLists"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<TaskList[]>>(
        "/api/task-lists",
        { auth: true }
      );
      return response.data;
    },
    refetchInterval: 30000,
  });
}
