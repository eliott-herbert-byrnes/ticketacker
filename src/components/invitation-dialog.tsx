"use client";
import { LucidePlus } from "lucide-react";
import { useState } from "react";
import { FieldError } from "./form/field-error";
import { Form } from "./form/form";
import { SubmitButton } from "./form/submit-button";
import { ActionState } from "./form/utils/to-action-state";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type InvitationDialogProps = {
    title: string;
    description: string;
    action: (payload: FormData) => void;
    actionState: ActionState
}

const InvitationDialog = ({title, description, action, actionState}: InvitationDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-8 w-8">
          <LucidePlus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <Form action={action} actionState={actionState} onSuccess={handleClose}>
          <div className="grid gap-4 py-4">
            <div className="div">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  name="email"
                  type="email"
                  id="email"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div />
                <div className="col-span-3">
                  <FieldError actionState={actionState} name="email" />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <SubmitButton label="Invite" />
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { InvitationDialog };
