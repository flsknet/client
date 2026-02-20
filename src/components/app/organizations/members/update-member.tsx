import { msg } from "@lingui/core/macro";
import { Trans, useLingui } from "@lingui/react/macro";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import type { OrganizationMember } from "~/gen/api";
import {
  getOrganizationMemberOptions,
  updateOrganizationMemberMutation,
} from "~/gen/api/@tanstack/react-query.gen";
import { zUpdateOrganizationMemberBody } from "~/gen/api/zod.gen";

import { Form } from "~/components/form";

const ROLES = {
  member: msg`Member`,
  admin: msg`Admin`,
} as const;

interface UpdateMemberProps {
  organizationId: string;
  userId: string;
}

export function UpdateMember({ organizationId, userId }: UpdateMemberProps) {
  const navigate = useNavigate();
  const { t } = useLingui();

  const { data: member } = useSuspenseQuery(
    getOrganizationMemberOptions({ path: { organizationId, userId } })
  );

  const {
    mutate: updateMember,
    isPending,
    isSuccess,
  } = useMutation({
    ...updateOrganizationMemberMutation(),
    onSuccess: () => {
      navigate({
        to: "/organizations/$organizationId/settings/people",
        params: { organizationId },
      });
    },
  });

  return (
    <Form
      schema={zUpdateOrganizationMemberBody}
      onSubmit={(data) => {
        updateMember({
          path: { organizationId, userId },
          body: data,
        });
      }}
      options={{ defaultValues: member }}
    >
      {({ setValue, formState: { errors } }) => (
        <>
          <FormControl>
            <InputLabel>
              <Trans>Role</Trans>
            </InputLabel>
            <Select
              label={t`Role`}
              onChange={(event) => {
                if (event) {
                  setValue(
                    "role",
                    event.target.value as OrganizationMember["role"]
                  );
                }
              }}
              error={!!errors.role}
            >
              {Object.entries(ROLES).map(([key, value]) => (
                <MenuItem value={key} key={key}>
                  {t(value)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            loading={isPending}
            disabled={isSuccess}
            type="submit"
            sx={{ marginRight: "auto" }}
          >
            <Trans>Save</Trans>
          </Button>
        </>
      )}
    </Form>
  );
}
