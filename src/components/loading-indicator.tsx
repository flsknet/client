import {
  Backdrop,
  CircularProgress,
  LinearProgress,
  Paper,
  useMediaQuery,
} from "@mui/material";

export function LoadingIndicator() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  if (isMobile) {
    return (
      <Backdrop open={true} sx={{ zIndex: (theme) => theme.zIndex.appBar - 1 }}>
        <Paper
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 64,
            height: 64,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Paper>
      </Backdrop>
    );
  }

  return (
    <LinearProgress
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: 2,
        background: "transparent",
        zIndex: (theme) => theme.zIndex.modal,
      }}
    />
  );
}
