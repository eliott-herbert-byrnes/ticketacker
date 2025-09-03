"use client";
import { useParams, usePathname } from "next/navigation";
import {
  credentialsPath,
  invitationsPath,
  membershipsPath,
  organizationPath,
} from "@/app/paths";
import { Breadcrumbs } from "@/components/breadcrumbs";

type OrganizationBreadcrumbsProps = {
  organizationName?: string;
};

const OrganizationBreadcrumbs = ({
  organizationName,
}: OrganizationBreadcrumbsProps) => {
  const params = useParams<{ organizationId: string }>();
  const pathName = usePathname();

  const title = {
    memberships: "Memberships" as const,
    invitations: "Invitations" as const,
    credentials: "Credentials" as const,
  }[
    pathName.split("/").at(-1) as "memberships" | "invitations" | "credentials"
  ];

  if (!organizationName) {
    return null;
  }

  return (
    <Breadcrumbs
      breadcrumbs={[
        { title: "Organizations", href: organizationPath() },
        { title: organizationName },
        {
          title,
          dropdown: [
            {
              title: "Memberships",
              href: membershipsPath(params.organizationId),
            },
            {
              title: "Invitations",
              href: invitationsPath(params.organizationId),
            },
            {
              title: "Credentials",
              href: credentialsPath(params.organizationId),
            },
          ],
        },
      ]}
    />
  );
};

export { OrganizationBreadcrumbs };
