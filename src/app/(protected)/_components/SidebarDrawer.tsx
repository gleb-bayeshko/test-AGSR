"use client";

import { usePathname } from "next/navigation";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { sidebarList } from "../const";
import { useAppSelector } from "@/store/hooks";

export default function SidebarDrawer() {
  const pathname = usePathname();

  const drawerOpen = useAppSelector((state) => state.drawer.isOpen);

  return (
    <Drawer variant="persistent" open={drawerOpen} sx={{ padding: 0 }}>
      <Box
        sx={{
          px: 4,
          display: "flex",
          alignItems: "center",
          mb: 5,
        }}
      >
        <Image
          src="/images/logo.png"
          alt="Логотип"
          width={60}
          height={60}
          style={{ borderRadius: "50%" }}
        />
        <Typography
          variant="h4"
          component="h1"
          sx={{
            ml: 2,
            fontWeight: 700,
            textShadow: "2px 2px 2px rgba(0, 0, 0, 0.1)",
          }}
        >
          ToDo
        </Typography>
      </Box>
      <Box sx={{ overflow: "auto" }}>
        <List>
          {sidebarList.map(({ icon: Icon, id, path: itemPathname, title }) => (
            <ListItem disablePadding key={id}>
              <ListItemButton
                component={Link}
                href={itemPathname}
                selected={pathname === itemPathname}
              >
                <Icon size={24} />
                <ListItemText sx={{ ml: 2 }} primary={title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
