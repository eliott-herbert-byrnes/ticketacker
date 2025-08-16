
"use client";

import { LucideFolderPen, LucideLoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRenameDialog } from "@/components/rename-dialog"
import { Button } from "@/components/ui/button";
import { renameOrganization } from "../actions/rename-organization";

type OrganizationRenameButttonProps = {
    organizationName: string;
    organizationId: string;
}

const OrganizationRenameButtton = ({
  organizationName,
  organizationId,
}: OrganizationRenameButttonProps) => {
  const router = useRouter();

  const [renameButton, renameDialog] = useRenameDialog({
    organizationName,
    action: renameOrganization.bind(null, organizationId),
    trigger: (isPending) => (
      <Button variant="outline" size="icon">
        {isPending ? (
          <LucideLoaderCircle className="w-4 h-4 animate-spin" />
        ) : (
          <LucideFolderPen  className="w-4 h-4" />
        )}
      </Button>
    ),
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <>
      {renameDialog}
      {renameButton}
    </>
  );
};

export { OrganizationRenameButtton };
