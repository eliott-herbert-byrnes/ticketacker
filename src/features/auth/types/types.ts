import { getAuthOrRedirect } from "../queries/get-auth-or-redirect";

export type Auth = Awaited<ReturnType<typeof getAuthOrRedirect>>