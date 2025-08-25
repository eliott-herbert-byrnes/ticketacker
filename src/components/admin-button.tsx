import { InvitationCreateButton } from "@/features/invitation/components/invitation-create-button";
import { Badge } from "./ui/badge";

type AdminButtonProps = {
  organizationId: string;
};

const AdminButton = ({ organizationId }: AdminButtonProps) => {
  return (
    <div>
      <div className="flex flex-row items-center gap-x-2 pr-6">
        <Badge variant="default" className="h-8">
          <p className="text-xs">Admin area</p>
        </Badge>
        <InvitationCreateButton organizationId={organizationId} />
      </div>
    </div>
  );
};

export { AdminButton };
