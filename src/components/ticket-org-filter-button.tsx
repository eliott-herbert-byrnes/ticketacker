"use client";

import { useQueryStates } from "nuqs";
import { Button } from "@/components/ui/button";
import { orgOptions,orgParser } from "@/features/ticket/queries/search-params";

const label: Record<"all" | "active" | "none", string> = {
  all: "Organizations",
  active: "Active",
  none: "All",
};

export function TicketOrgFilterButton() {
  const [state, setState] = useQueryStates(orgParser, orgOptions);
  const current = (state.org ?? "all") as "all" | "active" | "none";
  const next = current === "all" ? "active" : current === "active" ? "none" : "all";

  return (
    <Button
      type="button"
      variant="secondary"
      className="whitespace-nowrap"
      onClick={() => setState({ org: next })}
      title={`Click to switch: ${label[next]}`}
    >
      {label[current]}
    </Button>
  );
}
