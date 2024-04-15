import { NavigateFn } from '@tanstack/react-router';
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

import { api } from '@/lib/api';
import { getFullApiPath } from '@/lib/path';
import {
  ManagerProfileSchema,
  ManagerProfileType,
} from '@/types/ManagerProfile';

import { AuthModal } from '../components/auth/AuthModal';
import { FullPageLoader } from '../components/loader/FullPageLoader';
import { getUserSession, handleSignout } from '../lib/cognito/UserPool';
import {
  AuthFlowType,
  StepKeys,
  useAuthFlowStore,
} from '../stores/useAuthFlowStore';
import { CognitoUserSchema, CognitoUserType } from '../types/User';

export const handleManagerProfile = async () => {
  const profile = await api.get(getFullApiPath('/manager-profile'));
  return v.parse(ManagerProfileSchema, profile.data);
};

export type AuthContextState = {
  isLoadingSession: boolean;
} & (
  | {
      session: CognitoUserSession;
      user: CognitoUserType;
      managerProfile?: ManagerProfileType;
    }
  | {
      session: undefined;
      user: undefined;
      managerProfile: undefined;
    }
);

export type AuthContextType = {
  setSession: (session: CognitoUserSession) => Promise<void>;
  signOut: (navigate: NavigateFn<any>) => void;

  resetSession: () => void;

  startAuthFlow: (options?: {
    isCreatedCompany?: AuthFlowType['isCreatedCompany'];
    forcedStep?: StepKeys;
  }) => void;
} & AuthContextState;

const AuthContext = createContext<AuthContextType>({
  setSession: async () => {},
  user: undefined,
  session: undefined,
  managerProfile: undefined,
  signOut: () => {},
  startAuthFlow: () => {},
  isLoadingSession: true,
  resetSession: () => {},
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
    managerProfile: undefined,
    isLoadingSession: true,
  });

  const handleGetSession = useCallback(async () => {
    setState((s) => ({ ...s, isLoadingSession: true }));

    try {
      const session = await getUserSession();

      await setSession(session);
    } catch (error) {
      setState({
        session: undefined,
        user: undefined,
        managerProfile: undefined,
        isLoadingSession: false,
      });
    }
  }, []);

  useEffect(() => {
    handleGetSession();
  }, [handleGetSession]);

  const setSession = async (session: CognitoUserSession) => {
    try {
      const cognitoUser = session.getIdToken().decodePayload();

      const parsedUser = v.parse(CognitoUserSchema, cognitoUser);

      let managerProfile: ManagerProfileType | undefined = undefined;

      try {
        managerProfile = await handleManagerProfile();
      } catch (error) {
        // do nothing
      }

      setState(() => {
        return {
          session,
          user: parsedUser,
          managerProfile,
          isLoadingSession: false,
        };
      });
    } catch (error) {
      setState({
        session: undefined,
        user: undefined,
        managerProfile: undefined,
        isLoadingSession: false,
      });

      console.error('AuthContext: setSession', error);
    }
  };

  const signOut = useCallback(
    (navigate: NavigateFn<any>) => {
      handleSignout();
      setState({
        session: undefined,
        user: undefined,
        managerProfile: undefined,
        isLoadingSession: false,
      });
      toast.info(t('auth:signout.success'));
      navigate({ to: '/' });
    },
    [t],
  );

  const startAuthFlow: AuthContextType['startAuthFlow'] = useCallback(
    (options) => {
      let key: StepKeys = options?.forcedStep ?? 'SIGN_IN';

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
      resetSession: () => handleGetSession(),
    }),
    [handleGetSession, signOut, startAuthFlow, state],
  );

  return (
    <AuthContext.Provider value={value}>
      {state.isLoadingSession ? (
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
