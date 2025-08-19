'use client'
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Form } from "@/components/form/form"
import { SubmitButton } from "@/components/form/submit-button"
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state"
import { useActionState } from "@/components/hooks/use-action-state"
import { acceptInvitation } from "../actions/accept-invitation"

type InvitationAcceptFormProps = {
    tokenId: string
}

const InvitationAcceptForm = ({tokenId}: InvitationAcceptFormProps) => {

    const router = useRouter()

    const [actionState, action] = useActionState(
        acceptInvitation.bind(null, tokenId),
        EMPTY_ACTION_STATE
    )

      useEffect(() => {
        if (actionState.status === "SUCCESS") {
          router.refresh();
    
          if (actionState.data?.redirectTo) {
            router.push(actionState.data.redirectTo);
          }
        }
      }, [actionState, router]);

    return (
        <Form action={action} actionState={actionState}>
            <SubmitButton label="Accept" />
        </Form>
    )
}

export {InvitationAcceptForm}