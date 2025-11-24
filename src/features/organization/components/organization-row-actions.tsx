"use client";

import {
  LucideArrowUpRightFromSquare,
  LucideFolderEdit,
  LucideFolderPen,
  LucideLoaderCircle,
  LucideLogOut,
  LucideTrash,
} from "lucide-react";
import Link from "next/link";
import { membershipsPath } from "@/app/paths";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MembershipDeleteButton } from "@/features/membership/components/membership-delete-button";
import { OrganizationDeleteButton } from "./organization-delete-button";
import { OrganizationRenameButtton } from "./organization-rename-button";
import { OrganizationSwitchButton } from "./organization-switch-button";

type OrganizationRowActionsProps = {
  organizationId: string;
  organizationName: string;
  membershipUserId: string;
  isAdmin: boolean;
  hasActive: boolean;
  isActive: boolean;
};

export function OrganizationRowActions({
  organizationId,
  organizationName,
  membershipUserId,
  isAdmin,
  hasActive,
  isActive,
}: OrganizationRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <LucideFolderEdit className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Switch active org */}
        <DropdownMenuItem
          disabled={isActive && hasActive}
          onSelect={(e) => e.preventDefault()}
        >
          <OrganizationSwitchButton
            organizationId={organizationId}
            trigger={
              <button
                type="submit"
                className="w-full flex items-center gap-2 text-left"
              >
                <LucideFolderEdit className="w-4 h-4" />
                <span
                  className={
                    !hasActive || isActive ? "text-primary" : undefined
                  }
                >
                  {!hasActive ? "Active" : isActive ? "Active" : "Switch"}
                </span>
              </button>
            }
          />
        </DropdownMenuItem>

        {/* View details (admin only) */}
        {isAdmin ? (
          <DropdownMenuItem asChild>
            <Link
              href={membershipsPath(organizationId)}
              className="flex items-center gap-2"
            >
              <LucideArrowUpRightFromSquare className="w-4 h-4" />
              <span>View members</span>
            </Link>
          </DropdownMenuItem>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <DropdownMenuItem
                  disabled
                  className="cursor-not-allowed flex items-center gap-2"
                >
                  <LucideArrowUpRightFromSquare className="w-4 h-4" />
                  <span>View members</span>
                </DropdownMenuItem>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Admins only</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Rename (admin only) */}
        {isAdmin ? (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <OrganizationRenameButtton
              organizationName={organizationName}
              organizationId={organizationId}
              trigger={(isPending: boolean) => (
                <button
                  type="button"
                  className="w-full flex items-center gap-2 text-left"
                >
                  {isPending ? (
                    <LucideLoaderCircle className="w-4 h-4 animate-spin" />
                  ) : (
                    <LucideFolderPen className="w-4 h-4" />
                  )}
                  <span>Rename</span>
                </button>
              )}
            />
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem disabled>Rename</DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Leave organization */}
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <MembershipDeleteButton
            organizationId={organizationId}
            userId={membershipUserId}
            trigger={(isPending: boolean) => (
              <button
                type="button"
                className="w-full flex items-center gap-2 text-left"
              >
                {isPending ? (
                  <LucideLoaderCircle className="w-4 h-4 animate-spin" />
                ) : (
                  <LucideLogOut className="w-4 h-4" />
                )}
                <span>Leave organization</span>
              </button>
            )}
          />
        </DropdownMenuItem>

        {/* Delete organization (admin only) */}
        {isAdmin ? (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <OrganizationDeleteButton
              organizationId={organizationId}
              trigger={(isPending: boolean) => (
                <button
                  type="button"
                  className="w-full flex items-center gap-2 text-left text-red-600"
                >
                  {isPending ? (
                    <LucideLoaderCircle className="w-4 h-4 animate-spin" />
                  ) : (
                    <LucideTrash className="w-4 h-4" />
                  )}
                  <span>Delete</span>
                </button>
              )}
            />
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem disabled className="text-red-600">
            <LucideTrash className="w-4 h-4 mr-2" /> Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
