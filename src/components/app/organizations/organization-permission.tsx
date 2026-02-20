import type { ReactNode } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";

import type { OrganizationMember } from "~/gen/api";
import { getOrganizationMemberOptions } from "~/gen/api/@tanstack/react-query.gen";

import { useSession } from "~/lib/auth";

interface OrganizationPermissionProps {
  /**
   * The content that should be rendered conditionally.
   */
  children?: ReactNode;
  /**
   * The id of the organization to check permissions for.
   */
  organizationId: string;
  /**
   * The roles allowed to view the content.
   */
  roles?: OrganizationMember["role"][];
  /**
   * The id of the user that the content belongs to.
   */
  targetId?: string;
}

/**
 * Renders children conditionally, based on the current user's permissions.
 */
export function OrganizationPermission({
  children,
  organizationId,
  roles,
  targetId,
}: OrganizationPermissionProps) {
  const session = useSession();

  const userId = session.data!.user.id;

  const { data: member } = useSuspenseQuery(
    getOrganizationMemberOptions({ path: { organizationId, userId } })
  );

  if (targetId && userId == targetId) {
    return children;
  }

  if (roles && roles.includes(member.role)) {
    return children;
  }

  return <></>;
}
