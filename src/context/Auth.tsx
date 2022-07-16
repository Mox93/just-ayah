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
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { LocationState } from "models";
import { auth } from "services/firebase";
import { pass } from "utils";
import { useGlobalT, useLanguage } from "hooks";
import LoadingPopup from "components/LoadingPopup";

const ADMIN_SIGN_IN = "authSignIn";

const googleAuthProvider = new GoogleAuthProvider();

interface AuthContext {
  user: User | null;
  signIn: () => void;
  signOut: () => void;
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

export const AuthProvider: FunctionComponent<AuthProviderProps> = ({
  children,
}) => {
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

  const authenticated = () => !!user;
  const authorized = () => !!user;
  // claims.roles?.admin;

  const signIn = () => {
    if (state) {
      window.localStorage.setItem(ADMIN_SIGN_IN, JSON.stringify(state));
    }

    signInWithRedirect(auth, googleAuthProvider).catch((error) =>
      console.log("signInWithRedirect.ERROR", error)
    );
  };

  useEffect(() => {
    getRedirectResult(auth).then((result) => {
      if (!result) return;

      const authSignIn = window.localStorage.getItem(ADMIN_SIGN_IN);
      window.localStorage.removeItem(ADMIN_SIGN_IN);

      const { from } = (
        authSignIn ? JSON.parse(authSignIn) : {}
      ) as LocationState;

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
  }, []);

  return (
    <authContext.Provider
      value={{ ...initialState, user, authenticated, authorized, signIn }}
    >
      {ready ? children : <LoadingPopup message={glb("loading")} />}
    </authContext.Provider>
  );
};
