import { FacebookLoginButton } from '../../oAuths/FacebookLoginButton';
import { GoogleLoginButton } from '../../oAuths/GoogleLoginButton';

export const OAuthForm = () => {
  const handleLoginWithFacebook = () => {
    console.log('login with facebook');
  };

  const handleLoginWithGoogle = () => {
    console.log('login with google');
  };

  return (
    <div className="pt-4 gap-4 flex flex-col">
      <FacebookLoginButton onClick={handleLoginWithFacebook} />
      <GoogleLoginButton onClick={handleLoginWithGoogle} />
    </div>
  );
};
