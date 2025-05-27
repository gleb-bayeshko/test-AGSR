import { useMutation } from "@tanstack/react-query";
import { LoginForm } from "@/utils/validations/loginSchema";
import { apiClient } from "@/lib/apiClient";
import { LoginResponse } from "@/utils/types/api";
import { ApiResponse } from "@/utils/api/apiResponse";

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginForm) =>
      apiClient.post<ApiResponse<LoginResponse>, LoginForm>(
        "/api/auth/login",
        data,
        {
          auth: false,
        }
      ),
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data?.data || {};

      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      }
    },
  });
}
