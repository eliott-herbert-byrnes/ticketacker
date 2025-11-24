import { LucideBook, LucideBookCopy, LucideCircleUser, LucideGem, LucideLibrary, LucideUsers } from "lucide-react";
import { accountProfilePath, demoPath, homePath, organizationPath, pricingPath, ticketsOrganizationPath, ticketsPath } from "@/app/paths";
import { NavItem } from "./types";

export const navItems: NavItem[] = [
  {
    title: "Demo Dashboard",
    icon: <LucideBook />,
    href: demoPath(),
  },
  {
    title: "All Tickets",
    icon: <LucideLibrary />,
    href: homePath(),
  },
  {
    title: "Our Tickets",
    icon: <LucideBookCopy />,
    href: ticketsOrganizationPath(),
  },
  {
    title: "My Tickets",
    icon: <LucideBook />,
    href: ticketsPath(),
  },
  {
    seperator: true,
    title: "Account",
    icon: <LucideCircleUser />,
    href: accountProfilePath(),
  },
  {
    seperator: true,
    title: "Organization",
    icon: <LucideUsers />,
    href: organizationPath(),
  },
  {
    title: "Pricing",
    icon: <LucideGem />,
    href: pricingPath(),
  }
];

export const closedClassName = 'text-background opacity-0 transition-all duration-300 group-hover:z-40 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2 group-hover:opacity-100'