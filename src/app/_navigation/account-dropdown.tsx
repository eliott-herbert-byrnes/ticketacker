// src/components/account-dropdown.tsx
"use client";

import { LucideGem, LucideLock, LucideLogOut, LucideUser } from "lucide-react";
import Link from "next/link";
import {
  accountPasswordPath,
  accountProfilePath,
  pricingPath,
} from "@/app/paths";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/features/auth/actions/sign-out";

type AuthUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type AccountDropdownProps = {
  user: AuthUser;
};

const AccountDropdown = ({ user }: AccountDropdownProps) => {
  const initial = user?.name?.[0]?.toUpperCase() ?? "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar className="">
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={accountProfilePath()}>
            <LucideUser className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={accountPasswordPath()}>
            <LucideLock className="mr-2 h-4 w-4" />
            <span>Password</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={pricingPath()}>
            <LucideGem className="mr-2 h-4 w-4" />
            <span>Pricing</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <form action={signOutAction}>
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full flex items-center">
              <LucideLogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { AccountDropdown };
