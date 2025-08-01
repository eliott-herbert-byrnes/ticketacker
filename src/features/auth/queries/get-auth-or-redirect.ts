import { redirect } from "next/navigation";
import { signInPath } from "@/app/paths";
import { getAuth } from "./get-auth";

export const getAuthOrRedirect = async () => {
    const auth = await getAuth();

  if (!auth.user) {
    redirect(signInPath());
  }

    return auth
}