'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { accountPasswordPath, accountProfilePath } from "@/app/paths";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AccountTabs = () => {

    const pathname = usePathname()

  return (
    <Tabs value={pathname.split('/').at(-1)} className="ml-4">
      <TabsList>
        <TabsTrigger value="profile" asChild>
          <Link href={accountProfilePath()}>Profile</Link>
        </TabsTrigger>
        <TabsTrigger value="password" asChild>
          <Link href={accountPasswordPath()}>Password</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export { AccountTabs };
