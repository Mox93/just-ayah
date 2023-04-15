import { db, user } from "@lib";

export const createUserProfile = user().onCreate((user) => {
  return db.collection("users").doc(user.uid).set({
    email: user.email,
    name: user.displayName,
    phoneNumber: user.phoneNumber,
    photo: user.photoURL,
  });
});

export const deleteUserProfile = user().onDelete((user) => {
  return db.collection("users").doc(user.uid).delete();
});
