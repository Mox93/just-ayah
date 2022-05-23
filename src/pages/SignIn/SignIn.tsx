import { VFC } from "react";

import justAyahBG from "assets/img/just-ayah-banner.jpg";
import { ReactComponent as GoogleLogo } from "assets/icons/google-svgrepo-com.svg";
import { Button } from "components/Buttons";
import LanguageSelector from "components/LanguageSelector";
import { useAuth } from "context/Auth";
import { useGlobalT } from "hooks";
import { capitalize } from "utils";

interface SignInProps {}

const SignIn: VFC<SignInProps> = () => {
  const glb = useGlobalT();

  const { signIn } = useAuth();

  return (
    <div className="SignIn" style={{ backgroundImage: `url(${justAyahBG})` }}>
      <LanguageSelector />
      <Button variant="secondary-outline" onClick={signIn}>
        <GoogleLogo className="GoogleLogo" />
        {capitalize(glb("googleSignIn"))}
      </Button>
    </div>
  );
};

export default SignIn;
