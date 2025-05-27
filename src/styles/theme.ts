import { createTheme } from "@mui/material/styles";
import "@fontsource/onest";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#E07A5F",
      light: "#F2CC8F",
    },
    secondary: {
      main: "#F2CC8F",
    },
    background: {
      default: "#FFF7F1",
      paper: "#FFFFFF",
    },
  },
  shape: {
    borderRadius: 12,
    borderRadiusSm: 4,
    borderRadiusMd: 8,
    borderRadiusLg: 16,
  },
  typography: {
    fontFamily: `"Onest", sans-serif`,
    h3: {
      fontWeight: 700,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(4),
          borderRadius: theme.shape.borderRadius * 2,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[4],
        }),
      },
      defaultProps: {
        elevation: 4,
      },
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          borderRadius: ownerState.square
            ? theme.shape.borderRadius / 2
            : theme.shape.borderRadius * 2,
          minWidth: ownerState.square ? 0 : "64px",
          textTransform: "none",
          fontWeight: 600,
          color:
            ownerState.variant === "outlined"
              ? theme.palette.primary.main
              : "#FFFFFF",
        }),
        sizeLarge: {
          height: "48px",
          fontSize: "1.2rem",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          "&.Mui-error": {
            fontSize: "1rem",
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: "2rem",
          paddingBottom: "2rem",
          "@media (min-width: 600px)": {
            maxWidth: "100%",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&[type="password"]': {
            letterSpacing: "0.3em",
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.palette.primary.light,
          color: "#fff",
          borderRight: "none",
          borderRadius: "0px 0px 0px 0px",
          paddingTop: theme.spacing(2),
          paddingBottom: theme.spacing(2),
          paddingLeft: 0,
          paddingRight: 0,
          width: 240,
        }),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          color: "#000",
          borderRadius: "0px 0px 0px 0px",
          borderBottom: `1px solid ${theme.palette.divider}`,
          padding: 0,
          boxShadow: "1px 1px 1px 1px rgba(0, 0, 0, 0.1)",
        }),
      },
    },
    MuiListItemButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          "&.Mui-selected": {
            backgroundColor: theme.palette.primary.main,
            color: "#fff",
            "&:hover": {
              backgroundColor: theme.palette.primary.main,
              color: "#fff",
            },
            "& .MuiTypography-root": {
              fontWeight: 600,
            },
          },
        }),
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          padding: 2,
          borderRadius: "7px",
        },
        list: {
          paddingTop: 0,
          paddingBottom: 0,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: "7px",
          "&:hover": {
            backgroundColor: theme.palette.primary.light,
            color: "#fff",
          },
        }),
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: () => ({
          padding: 0,
        }),
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          paddingBottom: 10,
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: () => ({
          paddingLeft: 24,
          paddingRight: 24,
          paddingBottom: 12,
        }),
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          paddingTop: "10px!important",
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: () => ({
          padding: 0,
          boxShadow: "none",
          border: "none",
          "&::before": {
            display: "none",
          },
        }),
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: () => ({
          padding: 0,
          paddingLeft: 12,
          paddingRight: 12,
          background: "#fff",
          borderRadius: "10px",
          fontWeight: 600,
          textShadow: "2px 2px 2px rgba(0, 0, 0, 0.1)",
          transition: "0.2s ease-in-out",
          boxShadow: "1px 1px 3px 1px #3B3B3B44",
          minHeight: "68px",
          "&:hover": {
            boxShadow: "1px 1px 10px 1px #3B3B3B4C",
          },
          "&.Mui-focusVisible": {
            background: "#fff",
          },
          "&.Mui-expanded": {
            padding: 0,
            paddingLeft: 12,
            paddingRight: 12,
            margin: 0,
            minHeight: "68px",
            ".MuiAccordionSummary-content": {
              margin: 0,
            },
          },
          "& .MuiSvgIcon-root": {},
        }),
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: 0,
          paddingBottom: 12,
        },
      },
    },
  },
});

export default theme;
