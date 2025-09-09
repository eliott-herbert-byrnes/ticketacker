"use client";

import { LucideLoaderCircle, LucideLogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactElement } from "react";
import { useConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { deleteMembership } from "../actions/delete-membership";

type MembershipDeleteButtonProps = {
  userId: string;
  organizationId: string;
  trigger?: (isPending: boolean) => ReactElement;
};

const MembershipDeleteButton = ({
  userId,
  organizationId,
  trigger,
}: MembershipDeleteButtonProps) => {
  const router = useRouter();

  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteMembership.bind(null, {
      userId,
      organizationId,
    }),
    trigger: (isPending) => (
      trigger ? (
        trigger(isPending)
      ) : (
        <Button variant="destructive" size="icon">
          {isPending ? (
            <LucideLoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <LucideLogOut className="w-4 h-4" />
          )}
        </Button>
      )
    ),
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <>
      {deleteDialog}
      {deleteButton}
    </>
  );
};

export { MembershipDeleteButton };
