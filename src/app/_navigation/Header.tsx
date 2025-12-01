"use client";

import { LucideSquirrel } from "lucide-react";
import Link from "next/link";
import { homePath, signInPath, signUpPath } from "@/app/paths";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { ThemeSwitcher } from "../../components/theme/theme-switcher";
import { buttonVariants } from "../../components/ui/button";
import { AccountDropdown } from "./account-dropdown";

const Header = () => {
  const { user, isFetched } = useAuth();

  if (!isFetched) {
    return null;
  }

  const navItems = user ? (
    <>
      <div className="flex items-center">
        <AccountDropdown user={user} />
      </div>
    </>
  ) : (
    <>
      <Link
        href={signUpPath()}
        className={buttonVariants({ variant: "outline" })}
      >
        Sign Up
      </Link>

      <Link
        href={signInPath()}
        className={buttonVariants({ variant: "default" })}
      >
        Sign In
      </Link>
    </>
  );

  return (
    <nav
      className="
        animate-[fade-from-top_0.5s_ease-out_forwards]
        supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-100 border-b bg-background/95 backdrop-blur w-full flex py-2.5 px-5 justify-between
        "
    >
      <div className="flex align-items gap-x-2">
        <Link
          href={homePath()}
          className={buttonVariants({ variant: "ghost" })}
        >
          <LucideSquirrel />
          <h1 className="text-lg font-semibold">TickeTacker</h1>
        </Link>
      </div>

      <div className="flex align-items gap-x-2 items-center">
        <ThemeSwitcher />
        {navItems}
      </div>
    </nav>
  );
};

export { Header };
