import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import { CgProfile } from "react-icons/cg";
import { useAppSelector } from "@/store/hooks";

export default function UserMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const router = useRouter();
  const user = useAppSelector((state) => state.user);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    router.push("/login?reason=unauthorized");
  };

  return (
    <>
      <IconButton onClick={handleOpen} size="large" color="inherit">
        <CgProfile size={24} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ px: 2, py: 1 }}
        >
          {user.email}
        </Typography>

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={handleLogout}>
          <ListItemText primary="Выход" />
        </MenuItem>
      </Menu>
    </>
  );
}
