import "@mui/material/Button";
import "@mui/material/IconButton";

declare module "@mui/material/Button" {
  interface ButtonOwnProps {
    square?: boolean;
  }
}

declare module "@mui/material/styles" {
  interface Shape {
    borderRadius: number;
    borderRadiusSm: number;
    borderRadiusMd: number;
    borderRadiusLg: number;
  }

  interface Theme {
    shape: Shape;
  }

  interface ThemeOptions {
    shape?: Partial<Shape>;
  }
}

declare module "@mui/material/IconButton" {
  interface IconButtonOwnProps {
    square?: boolean;
  }
}
