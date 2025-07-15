"use client";
import clsx from "clsx";
import { LucideLoaderCircle } from "lucide-react";
import { cloneElement } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";

type submitButtonProps = {
  label?: string;
  icon?: React.ReactElement<{ className: string }>;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
};

const SubmitButton = ({ label, icon, variant, size }: submitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit" className="cursor-pointer" variant={variant} size={size}>
      {pending && (
        <LucideLoaderCircle
          className={clsx("h-4 w-4 animate-spin", {
            mr: !!label,
          })}
        />
      )}
      {label}
      {pending ? null : icon ? (
        <span className="">
          {cloneElement(icon, {
            className: "h-4 w-4",
          })}
        </span>
      ) : null}
    </Button>
  );
};

export { SubmitButton };
