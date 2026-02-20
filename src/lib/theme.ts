import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          main: "#009688",
        },
        secondary: {
          main: "#1c1c1c",
        },
        background: {
          default: "#141414",
          paper: "#141414",
        },
        text: {
          primary: "#ffffff",
          secondary: "#bbbbbb",
        },
        error: {
          main: "#b71c1c",
        },
        divider: "#313131",
      },
    },
    light: {
      palette: {
        primary: {
          main: "#009688",
        },
        secondary: {
          main: "#f0f0f0",
        },
        background: {
          default: "#fcfcfc",
          paper: "#fcfcfc",
        },
        text: {
          primary: "#293239",
          secondary: "#535E70",
        },
        error: {
          main: "#b71c1c",
        },
        divider: "#DEE1E6",
      },
    },
  },
  typography: {
    h1: {
      fontSize: "1.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "1.2em",
      fontWeight: 700,
    },
    h3: {
      fontSize: "1.1rem",
      fontWeight: 700,
    },
    h4: {
      fontSize: "1rem",
      fontWeight: 700,
    },
    h5: {
      fontSize: "0.9rem",
      fontWeight: 700,
    },
    h6: {
      fontSize: "0.8rem",
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: ({ theme }) => ({
          borderColor: theme.vars.palette.divider,
        }),
      },
    },
    MuiList: {
      styleOverrides: {
        root: ({ theme }) => ({
          overflow: "hidden",
          [theme.breakpoints.up("md")]: {
            borderWidth: 1,
            borderColor: theme.vars.palette.divider,
            borderStyle: "solid",
            borderRadius: 4,
          },
          ".MuiListItemButton-root": {
            paddingTop: 12,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.vars.palette.divider,
            borderBottomStyle: "solid",
            "&:last-of-type": { borderBottom: 0 },
          },
        }),
      },
      defaultProps: {
        disablePadding: true,
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          background: theme.vars.palette.secondary.main,
        }),
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: 20,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderWidth: 1,
          borderColor: theme.vars.palette.divider,
          borderStyle: "solid",
          borderRadius: 4,
        }),
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: theme.vars.palette.secondary.main,
          "& .MuiTableRow-root": { borderTop: 0 },
        }),
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderTopWidth: 1,
          borderTopColor: theme.vars.palette.divider,
          borderTopStyle: "solid",
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: 0,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 12,
          paddingRight: 36,
        },
      },
    },
  },
  cssVariables: {
    colorSchemeSelector: "class",
  },
});
