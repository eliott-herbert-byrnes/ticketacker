'use client'
import { useActionState } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form"
import { SubmitButton } from "@/components/form/sumit-button"
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state"
import { Textarea } from "@/components/ui/textarea"
import { createComment } from "../actions/create-comment"


type CommentCreateFormProps = {
    ticketId: string
}

const CommentCreateForm = ({ticketId}: CommentCreateFormProps) => {

    const [actionState, action] = useActionState(
        createComment.bind(null, ticketId),
        EMPTY_ACTION_STATE
    )

    return (
       <Form action={action} actionState={actionState}>
        <Textarea className="text-sm mb-2" name="conent" placeholder="Add a comment..."/>
        <FieldError actionState={actionState} name="content" />
        <SubmitButton label="Comment"/>
       </Form>
    )
}

export {CommentCreateForm}