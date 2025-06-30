import { LucideMessageSquareWarning } from "lucide-react";
import { cloneElement,  ReactElement } from "react";

type placeholderType = {
    label: string;
    icon?: ReactElement<{className: string}>;
    button?: React.ReactElement<{className: string}>;
}

const Placeholder = ({
    label,
    icon = <LucideMessageSquareWarning />,
    button = <div />
}: placeholderType) => {
  return (
    <div className="flex-1 flex flex-row">
        <div className="flex-1 self-center flex flex-col items-center justify-center gap-y-2">
            {cloneElement(icon, {
                className: 'w-16 h-16'
            })}
            <h2 className="text-lg text-center">{label}</h2>
            {cloneElement(button, {
                className: 'h-10'
            })}
        </div>
    </div>
  )
}

export {Placeholder}