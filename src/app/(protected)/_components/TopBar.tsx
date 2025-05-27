"use client";

import { Box, AppBar, Toolbar } from "@mui/material";
import { LuPanelLeftOpen, LuPanelRightOpen } from "react-icons/lu";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleDrawer } from "@/store/slices/drawerSlice";
import { drawerWidth } from "../const";
import UserMenu from "./UserMenu";

export default function TopBar() {
  const dispatch = useAppDispatch();

  const drawerOpen = useAppSelector((state) => state.drawer.isOpen);

  const handleToggleDrawer = () => {
    dispatch(toggleDrawer());
  };

  const width = drawerOpen ? drawerWidth : 0;

  return (
    <AppBar
      position="fixed"
      sx={{
        width: {
          sm: `calc(100% - ${width}px)`,
          right: 0,
          transition: "width 0.2s",
        },
      }}
      elevation={1}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box onClick={handleToggleDrawer} sx={{ cursor: "pointer" }}>
          {drawerOpen ? (
            <LuPanelRightOpen size={24} />
          ) : (
            <LuPanelLeftOpen size={24} />
          )}
        </Box>
        <UserMenu />
      </Toolbar>
    </AppBar>
  );
}
