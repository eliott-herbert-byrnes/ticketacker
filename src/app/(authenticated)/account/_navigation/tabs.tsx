"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { accountPasswordPath, accountProfilePath } from "@/app/paths";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AccountTabs = () => {
  const pathname = usePathname();

  return (
    <div className="mb-2">
      <Tabs value={pathname.split("/").at(-1)} className="">
        <TabsList>
          <TabsTrigger value="profile" asChild>
            <Link href={accountProfilePath()}>Profile</Link>
          </TabsTrigger>
          <TabsTrigger value="password" asChild>
            <Link href={accountPasswordPath()}>Password</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export { AccountTabs };
