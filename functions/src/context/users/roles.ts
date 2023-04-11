import { auth, https } from "@lib";

export const setUserRoles = https.onCall(async ({ id, roles }, context) => {
  const userRoles = context.auth?.token.roles;
  if (!(userRoles?.admin && userRoles?.super)) {
    throw new https.HttpsError(
      "permission-denied",
      "You don't have sufficient permissions to perform this action"
    );
  }

  const user = await auth.getUser(id);

  return auth.setCustomUserClaims(id, { ...user.customClaims, roles });
});
