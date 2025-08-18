"use client"
import { useParams, usePathname } from "next/navigation";
import {
  invitationsPath,
  membershipsPath,
  organizationPath,
} from "@/app/paths";
import { Breadcrumbs } from "@/components/breadcrumbs";

type OrganizationBreadcrumbsProps = {
    organizationName?: string;
}

const OrganizationBreadcrumbs = ({organizationName}: OrganizationBreadcrumbsProps) => {
  // get url param + pathname
  const params = useParams<{ organizationId: string }>();
  const pathName = usePathname();

  // determine Breadcrumbs title based on last path segment
  const title = {
    memberships: "Memberships" as const,
    invitations: "Invitations" as const,
  }[pathName.split("/").at(-1) as "memberships" | "invitations"];

  if(!organizationName){
    return null
  }

  return (
    // Render Breadcrumbs component with links for Organizations
    <Breadcrumbs
      breadcrumbs={[
        { title: "Organizations", href: organizationPath() },
        {title: organizationName},
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
          ],
        },
      ]}
    />
  );
};

export { OrganizationBreadcrumbs };
