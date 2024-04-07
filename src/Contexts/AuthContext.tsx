import { CognitoUserSession } from 'amazon-cognito-identity-js';
import {
  createContext,
  PropsWithChildren,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import * as v from 'valibot';

import { AuthModal } from '../components/Auth/AuthModal';
import { FullPageLoader } from '../components/loader/FullPageLoader';
import { getUserSession, handleSignout } from '../lib/cognito/UserPool';
import {
  AuthFlowType,
  StepKeys,
  useAuthFlowStore,
} from '../stores/useAuthFlowStore';
import { CognitoUserSchema, CognitoUserType } from '../types/User';

export type AuthContextState =
  | {
      session: CognitoUserSession;
      user: CognitoUserType;
    }
  | {
      session: undefined;
      user: undefined;
    };

export type AuthContextType = {
  setSession: (session: CognitoUserSession) => void;
  signOut: () => void;

  startAuthFlow: (options?: {
    isCreatedCompany?: AuthFlowType['isCreatedCompany'];
  }) => void;
} & AuthContextState;

const AuthContext = createContext<AuthContextType>({
  setSession: () => {},
  user: undefined,
  session: undefined,
  signOut: () => {},
  startAuthFlow: () => {},
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within a AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation(['auth']);
  const openModal = useAuthFlowStore((s) => s.openModal);
  const [state, setState] = useState<AuthContextState>({
    user: undefined,
    session: undefined,
  });

  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const handleGetSession = useCallback(async () => {
    try {
      const session = await getUserSession();

      setSession(session);
    } catch (error) {
      setState({ session: undefined, user: undefined });
    }
  }, []);

  useEffect(() => {
    handleGetSession().finally(() => {
      setIsLoadingSession(false);
    });
  }, [handleGetSession]);

  const setSession = (session: CognitoUserSession) => {
    try {
      const cognitoUser = session.getIdToken().decodePayload();

      const parsedUser = v.parse(CognitoUserSchema, cognitoUser);

      setState(() => {
        return {
          session,
          user: parsedUser,
        };
      });
    } catch (error) {
      setState({ session: undefined, user: undefined });

      console.error('AuthContext: setSession', error);
    }
  };

  const signOut = useCallback(() => {
    handleSignout();
    setState({ session: undefined, user: undefined });

    toast.info(t('auth:signout.success'));
  }, [t]);

  const startAuthFlow: AuthContextType['startAuthFlow'] = useCallback(
    (options) => {
      let key: StepKeys = 'SIGN_IN';

      const userLoggedIn = !!state.user;

      if (userLoggedIn && options?.isCreatedCompany) {
        key = 'CREATE_COMPAGNY';
      }

      openModal(key, options);
    },
    [openModal, state.user],
  );

  const value = useMemo(
    () => ({
      ...state,
      setSession,
      signOut,
      startAuthFlow,
    }),
    [signOut, startAuthFlow, state],
  );

  return (
    <AuthContext.Provider value={value}>
      {isLoadingSession ? (
        <FullPageLoader />
      ) : (
        <>
          {children}
          <Suspense>
            <AuthModal />
          </Suspense>
        </>
      )}
    </AuthContext.Provider>
  );
};
