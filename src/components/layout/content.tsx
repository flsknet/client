import { Container, useMediaQuery, type ContainerProps } from "@mui/material";

interface ContentProps extends ContainerProps {
  disablePadding?: boolean;
}

export function Content({
  children,
  disablePadding,
  sx,
  ...props
}: ContentProps) {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  return (
    <Container
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        paddingTop: isMobile && disablePadding ? 0 : 2,
        paddingBottom: 10,
        paddingX: `${isMobile && disablePadding ? 0 : 16}px !important`,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Container>
  );
}
