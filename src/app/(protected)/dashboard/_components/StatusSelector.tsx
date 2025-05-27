import { Menu, MenuItem, Chip } from "@mui/material";
import { useState } from "react";
import { TaskStatus } from "@/utils/types/api";

export const statusMap: Record<
  TaskStatus,
  { label: string; color: "default" | "primary" | "success" | "info" }
> = {
  PENDING: { label: "Ожидает", color: "default" },
  IN_PROGRESS: { label: "В процессе", color: "info" },
  DONE: { label: "Выполнено", color: "success" },
};

export default function StatusSelector({
  currentStatus,
  onChange,
}: {
  currentStatus: TaskStatus;
  onChange: (newStatus: TaskStatus) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (status: TaskStatus) => {
    if (status !== currentStatus) {
      onChange(status);
    }
    handleClose();
  };

  const statusInfo = statusMap[currentStatus];

  return (
    <>
      <Chip
        label={statusInfo.label}
        color={statusInfo.color}
        size="small"
        onClick={handleOpen}
        sx={{ cursor: "pointer" }}
      />

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {Object.entries(statusMap).map(([key, value]) => (
          <MenuItem
            key={key}
            selected={key === currentStatus}
            onClick={() => handleSelect(key as TaskStatus)}
          >
            <Chip
              label={value.label}
              color={value.color}
              size="small"
              sx={{ width: "100%" }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
