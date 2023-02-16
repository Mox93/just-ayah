import justAyahBG from "assets/img/just-ayah-banner.jpg";
import { ReactComponent as GoogleLogo } from "assets/icons/google-svgrepo-com.svg";
import { Button } from "components/Buttons";
import LanguageSelector from "components/LanguageSelector";
import { useAuthContext } from "context";
import { useGlobalT } from "hooks";
import { capitalize } from "utils";

export default function SignIn() {
  const glb = useGlobalT();

  const { signIn } = useAuthContext();

  return (
    <div className="SignIn" style={{ backgroundImage: `url(${justAyahBG})` }}>
      <LanguageSelector />
      <Button
        variant="secondary-outline"
        size="large"
        onClick={signIn}
        className="SignInButton"
      >
        <GoogleLogo className="GoogleLogo" />
        {capitalize(glb("googleSignIn"))}
      </Button>
    </div>
  );
}
