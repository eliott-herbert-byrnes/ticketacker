'use client'
import { LucideLoaderCircle, LucideTrash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { revokeCredential } from "../actions/revoke-credential";

type CredentialRevokeButtonProps = {
  id: string;
  organizationId: string;
  revokedAt?: Date | null;
  createdAt: Date;
  isRevoked?: boolean;
};

const CredentialRevokeButton = ({
  id,
  organizationId,
  isRevoked,
}: CredentialRevokeButtonProps) => {
  const router = useRouter();

  const [revokeButton, revokeDialog] = useConfirmDialog({
    title: "Revoke credential?",
    description:
      "This will mark the credential as revoked immediately. Apps using this credential should stop working.",
    action: revokeCredential.bind(null, { id, organizationId }),
    trigger: (isPending) => (
      <Button
        variant={isRevoked ? "ghost" : "destructive"}
        size="icon"
        disabled={isRevoked || isPending}
      >
        {isPending ? (
          <LucideLoaderCircle className="w-4 h-4 animate-spin" />
        ) : (
          <LucideTrash className="w-4 h-4" />
        )}
      </Button>
    ),
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <>
      {revokeDialog}
      {revokeButton}
    </>
  );
};

export { CredentialRevokeButton };
