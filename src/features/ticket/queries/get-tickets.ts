import { Prisma } from "@prisma/client";
import { PAGE_SIZES } from "@/components/pagination/constants";
import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import { getOrgStripeFeatures } from "@/features/stripe/queries/get-org-features";
import { prisma } from "@/lib/prisma";
import { getTicketPermissions } from "../permissions/get-ticket-permissions";
import { ParsedSearchParams } from "./search-params";

type SortDir = "asc" | "desc";

const ALLOWED_TICKET_SORT_KEYS = [
  "createdAt",
  "updatedAt",
  "bounty",
  "status",
  "title",
  "deadline",
] as const;
type TicketSortKey = (typeof ALLOWED_TICKET_SORT_KEYS)[number];

function isTicketSortKey(key: string): key is TicketSortKey {
  return (ALLOWED_TICKET_SORT_KEYS as readonly string[]).includes(key);
}

function buildOrderBy(
  sortKey: string | undefined,
  sortValue: SortDir | undefined
): Prisma.TicketOrderByWithRelationInput {
  const dir: SortDir = sortValue === "asc" ? "asc" : "desc";

  if (sortKey === "organization.name" || sortKey === "organization") {
    return { organization: { name: dir } };
  }
  if (sortKey && isTicketSortKey(sortKey)) {
    return { [sortKey]: dir } as Prisma.TicketOrderByWithRelationInput;
  }
  return { createdAt: "desc" };
}

export const getTickets = async (
  userId: string | undefined,
  _byOrganization: boolean,
  searchParams: ParsedSearchParams
) => {
  const { user } = await getAuth();

  if (!PAGE_SIZES.includes(searchParams.size)) {
    throw new Error("Invalid page size");
  }

  const baseWhere: Prisma.TicketWhereInput = {
    ...(userId ? { userId } : {}),
    title: {
      contains: searchParams.search ?? "",
      mode: "insensitive",
    },
  };

  const org = (searchParams.org ?? "all") as "all" | "active" | "none";
  const orgFilter: Prisma.TicketWhereInput =
    userId && org !== "all"
      ? {
          organization:
            org === "active"
              ? { memberships: { some: { userId, isActive: true } } }
              : { memberships: { none: { userId, isActive: true } } },
        }
      : {};

  const viewerId = user?.id;
  const privacyFilter: Prisma.TicketWhereInput = viewerId
    ? {
        OR: [
          { private: false },
          { userId: viewerId },
          {
            organization: {
              memberships: { some: { userId: viewerId, isActive: true } },
            },
          },
        ],
      }
    : { private: false };

  const where: Prisma.TicketWhereInput = {
    AND: [baseWhere, orgFilter, privacyFilter],
  };

  const skip = (searchParams.page ?? 0) * (searchParams.size ?? 5);
  const take = searchParams.size ?? 5;
  const orderBy = buildOrderBy(
    searchParams.sortKey,
    searchParams.sortValue as SortDir
  );

  const [tickets, count] = await prisma.$transaction([
    prisma.ticket.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        user: { select: { username: true } },
        organization: { select: { id: true, name: true } },
      },
    }),
    prisma.ticket.count({ where }),
  ]);

  const permsList = await Promise.all(
    tickets.map((t) =>
      getTicketPermissions({
        organizationId: t.organizationId,
        userId: user?.id,
      })
    )
  );

  const uniqueOrgIds = Array.from(
    new Set(tickets.map((t) => t.organizationId))
  );
  const featuresEntries = await Promise.all(
    uniqueOrgIds.map(async (orgId) => {
      const f = await getOrgStripeFeatures(orgId);
      return [orgId, f] as const;
    })
  );
  const featuresByOrg = Object.fromEntries(featuresEntries);

  return {
    list: tickets.map((ticket, i) => {
      const owner = isOwner(user, ticket);
      const p = permsList[i];
      return {
        ...ticket,
        isOwner: owner,
        permission: {
          canDeleteTicket: owner || !!p.canDeleteTicket,
          canUpdateTicket: owner || !!p.canUpdateTicket,
        },
        features: featuresByOrg[ticket.organizationId],
      };
    }),
    metadata: { count, hasNextPage: count > skip + take },
  };
};
