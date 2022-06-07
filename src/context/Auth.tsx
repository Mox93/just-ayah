import {
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut as SignOutFB,
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

import { useLanguage } from "hooks";
import { LocationState } from "models";
import { auth } from "services/firebase";

const AUTH_SIGN_IN = "authSignIn";

const googleAuthProvider = new GoogleAuthProvider();

interface AuthContext {
  user: User | null;
  signIn: () => void;
  signOut: () => void;
  authorized: (path?: string) => boolean;
}

const initialState: AuthContext = {
  user: null,
  signIn: () =>
    signInWithRedirect(auth, googleAuthProvider)
      .then(() => console.log("Signed in successfully"))
      .catch((error) => console.log("signInWithRedirect.ERROR", error)),
  signOut: () =>
    SignOutFB(auth)
      .then(() => console.log("Signed out successfully"))
      .catch((error) => console.log("SignOutFB.ERROR", error)),
  authorized: pass(false),
};

const authContext = createContext(initialState);

export const useAuthContext = () => useContext(authContext);

interface AuthProviderProps {}

export const AuthProvider: FunctionComponent<AuthProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const [language] = useLanguage();

  auth.languageCode = language;

  const authorized = () => !!user;

  const signIn = () => {
    if (state) {
      window.localStorage.setItem(AUTH_SIGN_IN, JSON.stringify(state));
    }

    signInWithRedirect(auth, googleAuthProvider)
      .then(() => {
        console.log("Signed in successfully");
      })
      .catch((error) => console.log("signInWithRedirect.ERROR", error));
  };

  useEffect(() => {
    getRedirectResult(auth).then((result) => {
      if (!result) return;

      const authSignIn = window.localStorage.getItem(AUTH_SIGN_IN);
      window.localStorage.removeItem(AUTH_SIGN_IN);

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
    <authContext.Provider value={{ ...initialState, user, authorized, signIn }}>
      {ready ? children : "loading..."}
    </authContext.Provider>
  );
};
