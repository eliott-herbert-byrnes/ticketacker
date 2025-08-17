export const PERMISSION_KEYS = ["canDeleteTicket", "canUpdateTicket"] as const;
export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  canDeleteTicket: "Delete tickets",
  canUpdateTicket: "Update tickets",
};
