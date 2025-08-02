"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { cn } from "@/lib/utils";
import { navItems } from "../constants";
import { SidebarItem } from "./sidebar-item";

const Sidebar = () => {
  const { user, isFetched } = useAuth();
  const [isTransition, setTransition] = useState(false);
  const [isOpen, setOpen] = useState(false);

  const handleToggle = (open: boolean) => {
    setTransition(true);
    setOpen(open);
    setTimeout(() => setTransition(false), 200);
  };

  if (!user || !isFetched) {
    return <div className="w-[78px] bg-secondary/20 absolute" />;
  }

  return (
    <nav
      className={cn(
        "z-50 border-t md:border-t-0 md:border-r bg-secondary/20 flex md:flex-col w-full md:w-[78px] md:pt-24",
        isTransition && "duration-200",
        isOpen && "md:w-60"
      )}
      onMouseEnter={() => handleToggle(true)}
      onMouseLeave={() => handleToggle(false)}
    >
      <div className="flex md:flex-col md:justify-between w-full md:h-full py-2 px-4 md:px-3 md:py-2">
        
        <div className="flex md:flex-col gap-2 w-full md:space-y-2">
          {navItems
            .filter((item) => item.title !== "Account")
            .map((navItem) => (
              <SidebarItem
                key={navItem.title}
                isOpen={isOpen}
                navItem={navItem}
              />
            ))}
        </div>

        <div className="flex md:flex-col gap-2 md:space-y-2">
          {navItems
            .filter((item) => item.title === "Account")
            .map((navItem) => (
              <SidebarItem
                key={navItem.title}
                isOpen={isOpen}
                navItem={navItem}
              />
            ))}
        </div>
      </div>
    </nav>
  );
};

export { Sidebar };
