import {
  // getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
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
import { omit } from "utils";

interface AuthContextObj {
  user: User | null;
  signIn: () => void;
  signOut: () => void;
  authorized: (path?: string) => boolean;
}

const AuthContext = createContext<AuthContextObj>({
  user: null,
  signIn: omit,
  signOut: omit,
  authorized: () => false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {}

export const AuthProvider: FunctionComponent<AuthProviderProps> = ({
  children,
}) => {
  const signIn = () => signInWithRedirect(auth, new GoogleAuthProvider());

  const signOut$ = () =>
    signOut(auth)
      .then(() => console.log("Success"))
      .catch((err) => console.log(err));

  const authorized = () => (user ? true : false);

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
      (err) => console.log(err)
    );
  }, []);

  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut: signOut$, authorized }}
    >
      {ready ? children : "loading..."}
    </AuthContext.Provider>
  );
};
