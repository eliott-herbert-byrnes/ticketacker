"use client";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import {
  ActionState,
  EMPTY_ACTION_STATE,
} from "@/components/form/utils/to-action-state";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ACCEPTED } from "@/features/attachments/constants";
import { createComment } from "../actions/create-comment";
import { CommentWithMetadata } from "../types";

type CommentCreateFormProps = {
  ticketId: string;
  onCreateComment?: (comment: CommentWithMetadata | undefined) => void;
};

const CommentCreateForm = ({
  ticketId,
  onCreateComment,
}: CommentCreateFormProps) => {
  const router = useRouter();
  const [actionState, action] = useActionState(
    createComment.bind(null, ticketId),
    EMPTY_ACTION_STATE
  );

  const handleSuccess = (
    actionState: ActionState<CommentWithMetadata | undefined>
  ) => {
    if (actionState.data) {
        onCreateComment?.(actionState.data);
        router.refresh();
      }
  };

  return (
    <Form
      action={action}
      actionState={actionState}
      onSuccess={handleSuccess}
    >
      <Textarea
        className="text-sm mb-2"
        name="content"
        placeholder="Add a comment..."
      />
      <FieldError actionState={actionState} name="content" />

      <Input 
        name="files"
        id="files"
        type="file"
        multiple
        accept={ACCEPTED.join(", ")}
      />
      <FieldError actionState={actionState} name="files" />

      <SubmitButton label="Comment" />
    </Form>
  );
};

export { CommentCreateForm };
