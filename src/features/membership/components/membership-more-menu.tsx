// src/features/membership/components/membership-more-menu.tsx
'use client';

import { MembershipRole } from "@prisma/client";
import { LucideUserCog } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { updateMembershipRole } from "../actions/update-membership-role";

type MembershipMoreMenuProps = {
  userId: string;
  organizationId: string;
  membershipRole: MembershipRole;
};

const MembershipMoreMenu = ({
  userId,
  organizationId,
  membershipRole,
}: MembershipMoreMenuProps) => {
  const [isPending, startTransition] = useTransition();

  const handleUpdateMembershipRole = (value: string) => {
    startTransition(async () => {
      const p = updateMembershipRole({
        userId,
        organizationId,
        membershipRole: value as MembershipRole,
      });

      toast.promise(p, { loading: "Updating role..." });

      const result = await p;
      if (result.status === "ERROR") {
        toast.error(result.message);
      } else {
        toast.success(result.message);
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" disabled={isPending}>
          <LucideUserCog className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Roles</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={membershipRole}
          onValueChange={handleUpdateMembershipRole}
        >
          <DropdownMenuRadioItem value="ADMIN">Admin</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="MEMBER">Member</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { MembershipMoreMenu };
