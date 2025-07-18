type User = {
  id: string;
};

type Entity = {
  userId: string | null;
};

export const isOwner = (
  user: User | null | undefined,
  entity: Entity | null | undefined
) => {
  if (!user?.id || !entity?.userId) {
    return false;
  }

  return user.id === entity.userId;
};
