import { useEffect } from "react"
import { ActionState } from "../form/utils/to-action-state"

type onArgs = {
    actionState: ActionState
}

type useActionFeedbackOptions = {
    onSuccess?: (onArgs: onArgs) => void
    onError?: (onArgs: onArgs) => void
}

const useActionFeedback = (actionState: ActionState, options: useActionFeedbackOptions) => {
    useEffect(() => {
        if (actionState.status === 'SUCCESS'){
            options.onSuccess?.({actionState})
        }

        if (actionState.status === 'ERROR'){
            options.onError?.({actionState})
        }
    }, [actionState, options])
}

export {useActionFeedback}