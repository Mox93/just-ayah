import { auth, HttpsError, onCall } from "@lib";

export const setUserRoles = onCall(async ({ id, roles }, context) => {
  const userRoles = context.auth?.token.roles;
  if (!(userRoles?.admin && userRoles?.super)) {
    throw new HttpsError(
      "permission-denied",
      "You don't have sufficient permissions to perform this action"
    );
  }

  const user = await auth.getUser(id);

  return auth.setCustomUserClaims(id, { ...user.customClaims, roles });
});
