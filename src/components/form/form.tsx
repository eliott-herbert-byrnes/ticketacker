import { toast } from "sonner";
import { useActionFeedback } from "../hooks/use-action-feedback";
import { ActionState } from "./utils/to-action-state";

type FormProps<T = unknown> = {
  action: (payload: FormData) => void;
  children: React.ReactNode;
  actionState: ActionState<T>;
  onSuccess?: (actionState: ActionState<T>) => void;
  onError?: (actionState: ActionState<T>) => void;
};

const Form = <T,>({
  action,
  children,
  actionState,
  onSuccess,
  onError,
}: FormProps<T>) => {
  useActionFeedback<T>(actionState, {
    onSuccess: ({ actionState }) => {
      if (actionState.message) toast.success(actionState.message);
      onSuccess?.(actionState);
    },
    onError: ({ actionState }) => {
      if (actionState.message) toast.error(actionState.message);
      onError?.(actionState);
    },
  });

  return (
    <form action={action} className="flex flex-col gap-y-3">
      {children}
    </form>
  );
};

export { Form };
