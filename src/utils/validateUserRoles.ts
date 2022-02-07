type User = {
  tipo: string[];
};

type validateUserRolesParams = {
  user: User;
  tipo?: string[];
};

export function validateUserRoles({ user, tipo }: validateUserRolesParams) {
  if (tipo?.length) {
    const hasAllRoles = roles.some((tipo) => {
      return user.roles.includes(tipo);
    });

    if (!hasAllRoles) {
      return false;
    }
  }

  return true;
}
