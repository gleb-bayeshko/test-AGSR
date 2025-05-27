import { Button, ButtonProps, useTheme } from "@mui/material";
import React from "react";

interface ButtonWithIconProps extends ButtonProps {
  square?: boolean;
  icon: React.ReactNode;
}

export default function ButtonWithIcon({
  square = false,
  color = "primary",
  icon,
  ...props
}: ButtonWithIconProps) {
  const theme = useTheme();

  return (
    <Button
      variant="text"
      {...props}
      sx={{
        minWidth: '24px',
        minHeight: '24px',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: square ? "2px" : 1.5,
        borderRadius: square ? `${theme.shape.borderRadiusSm}px` : "50%",
        color: color === "inherit" ? "inherit" : theme.palette[color].main,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor:
            color === "inherit" ? "inherit" : theme.palette[color].main,
          color: theme.palette.common.white,
        },
        ...props.sx,
      }}
    >
      {icon}
    </Button>
  );
}
