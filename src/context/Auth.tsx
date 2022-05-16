import {
  // getRedirectResult,
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

import { auth } from "services/firebase";

const googleAuthProvider = new GoogleAuthProvider();

interface AuthContext {
  user: User | null;
  signIn: () => void;
  signOut: () => void;
  authorized: (path?: string) => boolean;
}

const InitialState: AuthContext = {
  user: null,
  signIn: () =>
    signInWithRedirect(auth, googleAuthProvider).then((result) =>
      console.log("signInWithRedirect", result)
    ),
  signOut: () =>
    SignOutFB(auth)
      .then(() => console.log("Signed out successfully"))
      .catch(console.log),
  authorized: () => false,
};

const authContext = createContext(InitialState);

export const useAuth = () => useContext(authContext);

interface AuthProviderProps {}

export const AuthProvider: FunctionComponent<AuthProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  const authorized = () => !!user;

  useEffect(() => {
    /*
    getRedirectResult(auth)
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
      console.log
    );
  }, []);

  return (
    <authContext.Provider value={{ ...InitialState, user, authorized }}>
      {ready ? children : "loading..."}
    </authContext.Provider>
  );
};
