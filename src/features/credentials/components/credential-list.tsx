import { format } from "date-fns";
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
    <Table>
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
  );
};

export { CredentialList };