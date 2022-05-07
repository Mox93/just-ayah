import { FunctionComponent } from "react";

import justAyahBG from "assets/img/just-ayah-banner.jpg";
import { ReactComponent as GoogleLogo } from "assets/icons/google-svgrepo-com.svg";
import { Button } from "components/Buttons";
import LanguageSelector from "components/LanguageSelector";
import { useAuth } from "context/Auth";
import { useGlobalT } from "utils/translation";
import { toCapitalized } from "utils";

interface SignUpProps {}

const SignUp: FunctionComponent<SignUpProps> = () => {
  const glb = useGlobalT();

  const { signIn } = useAuth();

  return (
    <div className="SignUp" style={{ backgroundImage: `url(${justAyahBG})` }}>
      <LanguageSelector />
      <Button variant="secondary-outline" onClick={signIn}>
        <GoogleLogo className="GoogleLogo" />
        {toCapitalized(glb("googleSignIn"))}
      </Button>
    </div>
  );
};

export default SignUp;
