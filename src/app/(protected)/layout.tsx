"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser, UserState } from "@/store/slices/userSlice";
import SidebarDrawer from "./_components/SidebarDrawer";
import { drawerWidth } from "./const";
import TopBar from "./_components/TopBar";
import ComponentWithChildren from "@/utils/types/componentWithChildren";

const unauthorizedPath = "/login?reason=unauthorized";

export default function ProtectedLayout({ children }: ComponentWithChildren) {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const drawerOpen = useAppSelector((state) => state.drawer.isOpen);
   const isLoaderVisible = useAppSelector((state) => state.loadingOverlay.isVisible);

  const [authorized, setAuthorized] = useState<null | boolean>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.replace(unauthorizedPath);
      return;
    }

    try {
      const decoded = jwtDecode(token) as UserState;
      dispatch(
        setUser({
          userId: decoded.userId,
          email: decoded.email,
        })
      );
    } catch {
      router.replace(unauthorizedPath);
      return;
    }

    setAuthorized(true);
  }, [dispatch, router]);

  if (authorized === null) {
    return null;
  }

  const width = drawerOpen ? drawerWidth : 0;

  return (
    <Box sx={{ height: "100vh" }}>
      <SidebarDrawer />

      <Box component="main">
        <TopBar />

        <Box
          sx={{
            width: `calc(100% - ${width}px)`,
            ml: `${width}px`,
            p: 4,
            paddingTop: "96px",
            transition: "0.2s",
          }}
        >
          <Box
            sx={{
              bgcolor: "background.paper",
              minHeight: "calc(100vh - 136px)",
              p: 2,
              borderRadius: "12px",
              boxShadow: "1px 1px 15px 1px rgba(0, 0, 0, 0.05)",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "0%",
                left: "0",
                right: "0",
                bottom: "0",
                display: isLoaderVisible ? "flex" : "none",
                justifyContent: "center",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.5)",
                zIndex: 50,
              }}
            >
              <CircularProgress />
            </Box>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
