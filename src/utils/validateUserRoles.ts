
type User = {
    roles: string[];
}

type validateUserRolesParams = {
    user: User;
    roles?: string[];
}

export function validateUserRoles({ user, roles}: validateUserRolesParams) {

    if (roles?.length) {
        const hasAllRoles = roles.some(role => {
            return user.roles.includes(role);
        });

        if (!hasAllRoles) {
            return false;
        }
    }

    return true;

}