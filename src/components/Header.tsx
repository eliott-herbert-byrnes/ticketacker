import { LucideSquirrel } from "lucide-react";
import Link from "next/link";
import { homePath, ticketsPath } from "@/app/paths";
import { buttonVariants } from "./ui/button";

const Header = () => {
  return (
    <nav
      className="
        supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur w-full flex py-2.5 px-5 justify-between
        "
    >
      <div className="">
        <Link
          href={homePath()}
          className={buttonVariants({ variant: "ghost" })}
        >
          <LucideSquirrel />
          <h1 className="text-lg font-semibold">TickeTacker</h1>
        </Link>
      </div>
      <div className="">
        <Link
          href={ticketsPath()}
          className={buttonVariants({ variant: "default" })}
        >
          Tickets
        </Link>
      </div>
    </nav>
  );
};

export { Header };
