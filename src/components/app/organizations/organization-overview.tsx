import { Trans, useLingui } from "@lingui/react/macro";
import { useSuspenseQuery } from "@tanstack/react-query";

import { CorporateFare, Forum, People, ViewKanban } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import MuiMarkdown from "mui-markdown";

import { getOrganizationOptions } from "~/gen/api/@tanstack/react-query.gen";

interface OrganizationOverviewProps {
  organizationId: string;
}

export function OrganizationOverview({
  organizationId,
}: OrganizationOverviewProps) {
  const { t } = useLingui();

  const { data: organization } = useSuspenseQuery(
    getOrganizationOptions({ path: { organizationId } })
  );

  const stats = [
    {
      label: t`People`,
      icon: <People />,
      value: organization.memberCount,
    },
    {
      label: t`Discussions`,
      icon: <Forum />,
      value: organization.discussionCount,
    },
    {
      label: t`Boards`,
      icon: <ViewKanban />,
      value: organization.boardCount,
    },
  ];

  return (
    <Stack sx={{ gap: 2 }}>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Avatar
          src={organization.image ?? undefined}
          sx={{ borderRadius: 1, width: 64, height: 64 }}
        >
          <CorporateFare />
        </Avatar>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h2">{organization.name}</Typography>
          {organization.description ? (
            <Typography
              sx={{
                fontSize: 14,
                color: (theme) => theme.vars!.palette.text.secondary,
              }}
            >
              {organization.description}
            </Typography>
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: (theme) => theme.vars!.palette.text.secondary,
              }}
            >
              <Trans>No description</Trans>
            </Typography>
          )}
        </Box>
      </Box>
      <Divider />
      <Grid container spacing={2} columns={{ xs: 1, sm: 2, lg: 3 }}>
        {stats.map((stat) => (
          <Grid size={1} key={stat.label}>
            <Card variant="outlined">
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                  <People />
                </Box>
                <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {!!organization.readme && (
        <Card variant="outlined">
          <CardContent>
            <MuiMarkdown>{organization.readme}</MuiMarkdown>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
