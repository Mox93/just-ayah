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
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Location, useLocation, useNavigate } from "react-router-dom";

import { auth } from "services/firebase";
import { pass } from "utils";
import { useGlobalT, useLanguage, useLocalStorage } from "hooks";
import LoadingPopup from "components/LoadingPopup";

const googleAuthProvider = new GoogleAuthProvider();

export interface LocationState {
  from?: Location;
}

interface AuthContext {
  user: User | null;
  signIn: VoidFunction;
  signOut: VoidFunction;
  authenticated: (path?: string) => boolean;
  authorized: (path?: string) => boolean;
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

interface AuthProviderProps {}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const glb = useGlobalT();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [claims, setClaims] = useState<Claims>({});
  const { state } = useLocation();
  const navigate = useNavigate();
  const [language] = useLanguage();
  auth.languageCode = language;

  useEffect(() => {
    user?.getIdTokenResult().then((token) => setClaims(token.claims));
  }, [user]);

  const authenticated = useCallback(() => !!user, [user]);
  const authorized = useCallback(() => !!user, [user]);
  // claims.roles?.admin;

  const signInSession = useLocalStorage<LocationState>("signInSession");

  const signIn = useCallback(() => {
    if (state) signInSession.set(state as LocationState);

    signInWithRedirect(auth, googleAuthProvider).catch((error) =>
      console.log("signInWithRedirect.ERROR", error)
    );
  }, [signInSession, state]);

  useEffect(() => {
    getRedirectResult(auth).then((result) => {
      if (!result) return;

      const { from } = signInSession.data ?? {};
      signInSession.delete();

      if (from) navigate(from);
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
  }, [navigate, signInSession]);

  return (
    <authContext.Provider
      value={{ ...initialState, user, authenticated, authorized, signIn }}
    >
      {ready ? children : <LoadingPopup message={glb("loading")} />}
    </authContext.Provider>
  );
};
