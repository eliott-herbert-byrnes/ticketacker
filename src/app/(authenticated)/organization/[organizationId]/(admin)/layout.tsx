import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";

export default async function AdminLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{organizationId: string}>;
}>) {
    // Get organization from URL
    const {organizationId} = await params;

    // auth admin check
    await getAdminOrRedirect(organizationId);

    return <>{children}</>
}