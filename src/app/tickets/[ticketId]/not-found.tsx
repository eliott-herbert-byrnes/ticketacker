

import Link from "next/link";
import { ticketsPath } from "@/app/paths";
import { Placeholder } from "@/components/Placeholder";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Placeholder
      label="Ticket Not Found"
      button={
        <Button asChild>
          <Link href={ticketsPath()}>Go to Tickets</Link>
        </Button>
      }
    />
  );
}
