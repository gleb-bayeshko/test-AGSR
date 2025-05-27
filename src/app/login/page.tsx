"use client";

import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginForm, loginSchema } from "@/utils/validations/loginSchema";
import { useLogin } from "@/app/_queries/auth/useLogin";
import { useRouter, useSearchParams } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { clearUser } from "@/store/slices/userSlice";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dispatch = useAppDispatch();

  const reason = searchParams.get("reason");

  const [showForm, setShowForm] = useState<boolean>(false);

  const { mutateAsync: loginMutation } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await loginMutation(data);

      router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (reason === "unauthorized") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch(clearUser());
      setShowForm(true);
    } else if (accessToken) {
      try {
        jwtDecode(accessToken);
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setShowForm(true);
        return;
      }
      router.push("/dashboard");
    } else {
      setShowForm(true);
    }
  }, [dispatch, reason, router]);

  if (!showForm) return null;

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper sx={{ maxWidth: 600, width: "100%" }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Авторизация
        </Typography>

        <Box
          component="form"
          autoComplete="on"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
            autoComplete="email"
            disabled={isSubmitting}
            {...register("email")}
          />
          <TextField
            label="Пароль"
            type="password"
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
            autoComplete="current-password"
            disabled={isSubmitting}
            {...register("password")}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={isSubmitting}
          >
            Войти
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
