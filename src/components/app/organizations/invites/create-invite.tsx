import { msg } from "@lingui/core/macro";
import { Trans, useLingui } from "@lingui/react/macro";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import { createOrganizationInviteMutation } from "~/gen/api/@tanstack/react-query.gen";
import { zCreateOrganizationInviteBody } from "~/gen/api/zod.gen";

import { Form } from "~/components/form";

const EXPIRATION_TIMESTAMPS = [
  {
    label: msg`Never`,
    duration: 0,
  },
  {
    label: msg`5 minutes`,
    duration: 1000 * 60 * 5,
  },

  {
    label: msg`30 minutes`,
    duration: 1000 * 60 * 30,
  },
  {
    label: msg`1 hour`,
    duration: 1000 * 60 * 60,
  },
  {
    label: msg`12 hours`,
    duration: 1000 * 60 * 60 * 12,
  },
  {
    label: msg`24 hours`,
    duration: 1000 * 60 * 60 * 24,
  },
  {
    label: msg`1 week`,
    duration: 1000 * 60 * 60 * 24 * 7,
  },
  {
    label: msg`1 month`,
    duration: 1000 * 60 * 60 * 24 * 30,
  },
  {
    label: msg`6 months`,
    duration: 1000 * 60 * 60 * 24 * 180,
  },
  {
    label: msg`1 year`,
    duration: 1000 * 60 * 60 * 24 * 365,
  },
];

interface CreateInviteProps {
  organizationId: string;
}

export function CreateInvite({ organizationId }: CreateInviteProps) {
  const navigate = useNavigate();
  const { t } = useLingui();

  const {
    mutate: createInvite,
    isPending,
    isSuccess,
  } = useMutation({
    ...createOrganizationInviteMutation(),
    onSuccess: () => {
      navigate({
        to: "/organizations/$organizationId/settings/invites",
        params: { organizationId },
      });
    },
  });

  return (
    <Form
      schema={zCreateOrganizationInviteBody}
      onSubmit={(data) => {
        createInvite({
          path: { organizationId },
          body: data,
        });
      }}
    >
      {({ setValue, formState: { errors } }) => (
        <>
          <FormControl>
            <InputLabel>
              <Trans>Expires in</Trans>
            </InputLabel>
            <Select
              label={t`Expires in`}
              onChange={(event) => {
                if (event) {
                  const timestamp = event.target.value as number;
                  const expiresAt = new Date(Date.now() + timestamp);
                  setValue(
                    "expiresAt",
                    timestamp === 0 ? undefined : expiresAt.toISOString()
                  );
                }
              }}
              error={!!errors.expiresAt}
            >
              {EXPIRATION_TIMESTAMPS.map((timestamp) => (
                <MenuItem value={timestamp.duration} key={timestamp.duration}>
                  {t(timestamp.label)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            label={t`Single use`}
            control={
              <Checkbox
                onChange={(event) =>
                  setValue("singleUse", event.target.checked)
                }
                sx={{ height: 24 }}
              />
            }
          />
          <Button
            loading={isPending}
            disabled={isSuccess}
            type="submit"
            sx={{ marginRight: "auto" }}
          >
            <Trans>Create</Trans>
          </Button>
        </>
      )}
    </Form>
  );
}
