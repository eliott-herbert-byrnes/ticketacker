"use client";

import { useCallback, useState, useTransition } from "react";
import { ActionState } from "../form/utils/to-action-state";

export function useActionState<T extends ActionState>(
  action: (state: T, formData: FormData) => Promise<T>,
  initialState: T
): [T, (formData: FormData) => void, boolean] {
  const [actionState, setActionState] = useState<T>(initialState);
  const [isPending, startTransition] = useTransition();

  const formAction = useCallback(
    (formData: FormData) => {
      startTransition(async () => {
        const nextState = await action(actionState, formData);
        setActionState(nextState);
      });
    },
    [action, actionState]
  );

  return [actionState, formAction, isPending];
}