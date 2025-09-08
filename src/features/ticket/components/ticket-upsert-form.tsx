"use client";

import { Ticket } from "@prisma/client";
import { useRef, useState } from "react";
import {
  DatePicker,
  ImperativeHandleFromDatePicker,
} from "@/components/date-picker";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { useActionState } from "@/components/hooks/use-action-state";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UpsertTicket } from "@/features/ticket/actions/upsert-ticket";
import { fromCent } from "@/utils/currency";

type TicketUpsertFormProps = {
  ticket?: Ticket;
  canMakePrivateTickets: boolean;
};

const TicketUpsertForm = ({
  ticket,
  canMakePrivateTickets,
}: TicketUpsertFormProps) => {
  const [actionState, action] = useActionState(
    UpsertTicket.bind(null, ticket?.id),
    EMPTY_ACTION_STATE
  );

  const [isPrivate, setIsPrivate] = useState<boolean>(!!ticket?.private);

  const datePickerImperativeHandleRef =
    useRef<ImperativeHandleFromDatePicker>(null);

  const handleSuccess = () => {
    datePickerImperativeHandleRef.current?.reset();
  };

  const checkbox = (
    <Label
      htmlFor="private"
      className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-2 has-[[aria-checked=true]]:border-primary/60 has-[[aria-checked=true]]:bg-primary/50 dark:has-[[aria-checked=true]]:border-primary/90 dark:has-[[aria-checked=true]]:bg-primary/15 mb-1"
    >
      <Checkbox
        id="private"
        checked={isPrivate}
        onCheckedChange={(v) => setIsPrivate(!!v)}
        disabled={!canMakePrivateTickets}
        aria-disabled={!canMakePrivateTickets}
        className="data-[state=checked]:border-primary/60 data-[state=checked]:bg-primary/60 data-[state=checked]:text-white dark:data-[state=checked]:border-primary/70 dark:data-[state=checked]:bg-primary/70"
      />
      <div className="grid gap-1.5 font-normal">
        <p className="text-sm leading-none font-medium">Private</p>
        <p className="text-muted-foreground text-sm">
          Make this ticket visible only to your organization
        </p>
      </div>
    </Label>
  );

  return (
    <Form action={action} actionState={actionState} onSuccess={handleSuccess}>
      <Label htmlFor="title">Title</Label>
      <Input
        id="title"
        name="title"
        type="text"
        defaultValue={
          (actionState.payload?.get("title") as string) ?? ticket?.title
        }
      />

      <FieldError actionState={actionState} name="title" />

      <Label htmlFor="content">Content</Label>
      <Textarea
        id="content"
        name="content"
        defaultValue={
          (actionState.payload?.get("content") as string) ?? ticket?.content
        }
      />

      <FieldError actionState={actionState} name="content" />

      <div className="flex gap-x-2 mb-1">
        <div className="w-1/2">
          <Label className="mb-2" htmlFor="deadline">
            Deadline
          </Label>
          <DatePicker
            id="deadline"
            name="deadline"
            defaultValue={
              (actionState.payload?.get("deadline") as string) ??
              ticket?.deadline
            }
            imperativeHandleRef={datePickerImperativeHandleRef}
          />

          <FieldError actionState={actionState} name="deadline" />
        </div>

        <div className="w-1/2">
          <Label className="mb-2" htmlFor="bounty">
            Bounty ($){" "}
          </Label>
          <Input
            id="bounty"
            name="bounty"
            type="number"
            step="0.01"
            defaultValue={
              (actionState.payload?.get("bounty") as string) ??
              (ticket?.bounty ? fromCent(ticket?.bounty) : "")
            }
          />

          <FieldError actionState={actionState} name="bounty" />
        </div>
      </div>

      <input
        type="hidden"
        name="private"
        value={isPrivate ? "true" : "false"}
      />

      {canMakePrivateTickets ? (
        checkbox
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-not-allowed">{checkbox}</div>
            </TooltipTrigger>
            <TooltipContent>
              Sign up for a subscription to activate this feature
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <SubmitButton label={ticket ? "Edit" : "Create"} />
    </Form>
  );
};

export { TicketUpsertForm };
