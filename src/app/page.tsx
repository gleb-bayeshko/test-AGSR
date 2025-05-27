"use client";

import { Box, Button, Container, Paper, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper sx={{ px: 10, maxWidth: 700, width: "100%" }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
          <Image
            src="/images/logo.png"
            alt="Логотип"
            width={120}
            height={120}
            style={{ borderRadius: "50%" }}
          />

          <Typography variant="h3" component="h1">
            Добро пожаловать!
          </Typography>

          <Typography variant="subtitle1">
            Пожалуйста, войдите в систему, чтобы продолжить
          </Typography>

          <Link href="/login" passHref>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ px: 14 }}
            >
              Войти
            </Button>
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}
