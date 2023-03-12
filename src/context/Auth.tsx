import {
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  ParsedToken,
  signInWithRedirect,
  signOut as _SignOut,
  User,
} from "firebase/auth";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { To, useLocation } from "react-router-dom";

import LoadingPopup from "components/LoadingPopup";
import { useGlobalT, useLanguage, useLocalStorage } from "hooks";
import { Location } from "models";
import { auth } from "services/firebase";
import { pass } from "utils";

const googleAuthProvider = new GoogleAuthProvider();

interface AuthContext {
  user: User | null;
  signIn: VoidFunction;
  signOut: VoidFunction;
  authenticated: (path?: To) => boolean;
  authorized: (path?: To) => boolean;
}

interface Claims extends ParsedToken {
  roles?: Record<string, boolean>;
}

const initialState: AuthContext = {
  user: null,
  signIn: () =>
    signInWithRedirect(auth, googleAuthProvider)
      .then(() => console.log("Signed in successfully"))
      .catch((error) => console.log("signInWithRedirect.ERROR", error)),
  signOut: () =>
    _SignOut(auth)
      .then(() => window.location.reload())
      .catch((error) => console.log("SignOut.ERROR", error)),
  authenticated: pass(false),
  authorized: pass(false),
};

const authContext = createContext(initialState);

export const useAuthContext = () => useContext(authContext);

export function AuthProvider({ children }: PropsWithChildren) {
  const glb = useGlobalT();
  // TODO move this into a reducer
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [claims, setClaims] = useState<Claims>({});
  const { state } = useLocation() as Location<{ from: To } | undefined>;
  const [language] = useLanguage();
  auth.languageCode = language;

  useEffect(() => {
    user?.getIdTokenResult().then((token) => setClaims(token.claims));
  }, [user]);

  const authenticated = useCallback(() => !!user, [user]);
  const authorized = useCallback(() => !!user, [user]);
  // claims.roles?.admin;

  const signInSession = useLocalStorage<{ from: To }>("signInSession");

  const signIn = useCallback(() => {
    if (state) signInSession.set(state);

    signInWithRedirect(auth, googleAuthProvider).catch((error) =>
      console.log("signInWithRedirect.ERROR", error)
    );
  }, [signInSession, state]);

  useEffect(() => {
    getRedirectResult(auth).then((result) => {
      if (!result) return;

      signInSession.clear();
    });
    /*
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access Google APIs.
        if (result) {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential ? credential.accessToken : null;

          // The signed-in user info.
          const user = result.user;

          console.log({ token, user });
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...

        console.log({ errorCode, errorMessage, email, credential });
      });
*/

    return onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setReady(true);
      },
      (error) => console.log("onAuthStateChanged.ERROR", error)
    );
  }, [signInSession]);

  return (
    <authContext.Provider
      value={{ ...initialState, user, authenticated, authorized, signIn }}
    >
      {ready ? children : <LoadingPopup message={glb("loading")} />}
    </authContext.Provider>
  );
}
