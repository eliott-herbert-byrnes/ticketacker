import { format } from "date-fns";
import { CardCompact } from "@/components/card-compact";
import { Placeholder } from "@/components/Placeholder";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCredentials } from "../queries/get-credentials";
import { CredentialRevokeButton } from "./credential-revoke-button";

type CredentialListProps = {
  organizationId: string;
};

const CredentialList = async ({ organizationId }: CredentialListProps) => {
  const credentials = await getCredentials(organizationId);

  if (!credentials.length) {
    return <Placeholder label="No credentials for this organization" />;
  }

  return (
    <>
      {/* Mobile: cards */}
      <div className="md:hidden px-4 space-y-3">
        {credentials.map((cred) => {
          const isRevoked = cred.revokedAt && cred.revokedAt > cred.createdAt;
          return (
            <CardCompact
              key={cred.id}
              title={cred.name}
              description={`Created by: ${cred.createdBy?.username ?? "Deleted user"}`}
              content={
                <div className="flex flex-col gap-1.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Created At</span>
                    <span>{format(cred.createdAt, "yyyy-MM-dd, HH:mm")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last Used</span>
                    <span>{cred.lastUsed ? format(cred.lastUsed, "yyyy-MM-dd, HH:mm") : "Never"}</span>
                  </div>
                </div>
              }
              footer={
                <div className="flex w-full justify-end">
                  <CredentialRevokeButton
                    id={cred.id}
                    organizationId={organizationId}
                    revokedAt={cred.revokedAt ?? null}
                    createdAt={cred.createdAt}
                    isRevoked={!!isRevoked}
                  />
                </div>
              }
              className="w-full"
            />
          );
        })}
      </div>

      {/* Desktop: table */}
      <Table className="hidden md:table">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Last Used</TableHead>
            <TableHead>Revoke</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {credentials.map((credential) => {

            const isRevoked = credential.revokedAt && credential.revokedAt > credential.createdAt;

            const buttons = 
            <>
            <CredentialRevokeButton 
            id={credential.id}
            organizationId={organizationId}
            revokedAt={credential.revokedAt ?? null}
            createdAt={credential.createdAt}
            isRevoked={!!isRevoked}
            />
            </>; 

            return (
              <TableRow key={credential.id}>
                <TableCell>{credential.name}</TableCell>
                <TableCell>
                  {format(credential.createdAt, "yyyy-MM-dd, HH:mm")}
                </TableCell>
                <TableCell>{credential.createdBy?.username ?? "Deleted user"}</TableCell>
                <TableCell>
                  {credential.lastUsed
                    ? format(credential.lastUsed, "yyyy-MM-dd, HH:mm")
                    : "Never"}
                </TableCell>
                <TableCell className="flex gap-x-2">
                  {buttons}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export { CredentialList };