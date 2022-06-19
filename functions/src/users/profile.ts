import * as functions from "firebase-functions";

import { db } from "../utils";

export const createUserProfile = functions.auth.user().onCreate((user) => {
  return db.collection("users").doc(user.uid).set({
    email: user.email,
    name: user.displayName,
    phoneNumber: user.phoneNumber,
    photo: user.photoURL,
  });
});

export const deleteUserProfile = functions.auth.user().onDelete((user) => {
  return db.collection("users").doc(user.uid).delete();
});
