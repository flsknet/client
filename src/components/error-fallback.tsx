import { Trans } from "@lingui/react/macro";
import { Replay } from "@mui/icons-material";
import { Alert, IconButton } from "@mui/material";

export function ErrorFallback() {
  return (
    <Alert severity="error" variant="standard" sx={{ position: "relative" }}>
      <Trans>An error occured.</Trans>
      <IconButton
        onClick={() => window.location.reload()}
        sx={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          right: 4,
        }}
      >
        <Replay />
      </IconButton>
    </Alert>
  );
}
