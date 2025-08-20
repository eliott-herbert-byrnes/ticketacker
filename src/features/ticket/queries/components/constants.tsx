import { LucideFile,LucideFileCheck, LucideFileText } from "lucide-react";

export const TICKET_ICONS = {
  COMPLETE: <LucideFileCheck />,
  IN_PROGRESS: <LucideFileText />,
  OPEN: <LucideFile />,
};

export const TICKET_ICONS_LABELS = {
  COMPLETE: "Complete",
  IN_PROGRESS: "In Progress",
  OPEN: "Open",
};