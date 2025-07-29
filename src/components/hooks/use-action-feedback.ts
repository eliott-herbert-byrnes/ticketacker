import { useEffect, useRef } from "react";
import { ActionState } from "../form/utils/to-action-state";

// Make the hook generic over T
type OnArgs<T> = {
  actionState: ActionState<T>;
};

type UseActionFeedbackOptions<T> = {
  onSuccess?: (args: OnArgs<T>) => void;
  onError?: (args: OnArgs<T>) => void;
};

const useActionFeedback = <T,>(
  actionState: ActionState<T>,
  options: UseActionFeedbackOptions<T>
) => {
  const prevTimestamp = useRef(actionState.timestamp);
  const isUpdate = prevTimestamp.current !== actionState.timestamp;

  useEffect(() => {
    if (!isUpdate) return;

    if (actionState.status === "SUCCESS") {
      options.onSuccess?.({ actionState });
    }

    if (actionState.status === "ERROR") {
      options.onError?.({ actionState });
    }

    prevTimestamp.current = actionState.timestamp;
  }, [isUpdate, actionState, options]);
};

export { useActionFeedback };
