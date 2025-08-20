"use client";

import { useQueryStates } from "nuqs";
import { Button } from "@/components/ui/button";
import { orgOptions,orgParser } from "@/features/ticket/queries/search-params";

const label: Record<"all" | "active" , string> = {
  all: "Organizations",
  active: "Organizations",
};

export function TicketOrgFilterButton() {
  const [state, setState] = useQueryStates(orgParser, orgOptions);

  const current = (state.org ?? "all") as "all" | "active";
  const next = current === "all" ? "active" : current === "active" ? "all" : 'active';

  return (
    <Button
      type="button"
      variant={
        current === 'active' ? 'default' :
        'secondary'
      }
      className="whitespace-nowrap"
      onClick={() => setState({ org: next })}
      title={`Click to switch: ${label[next]}`}
    >
      {label[current]}
    </Button>
  );
}
