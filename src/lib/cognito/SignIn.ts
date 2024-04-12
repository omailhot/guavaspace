import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';

import { useAuthFlowStore } from '../../stores/useAuthFlowStore';
import { SignInType } from '../../types/User';
import { parseCognitoError } from './Errors';
import { POOL_DATA } from './UserPool';

export async function handleSignin({ email, password }: SignInType) {
  const userPool = new CognitoUserPool(POOL_DATA);
  const user = new CognitoUser({
    Username: email,
    Pool: userPool,
  });

  useAuthFlowStore.getState().setUsername(email);

  const authenticationDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });

  return new Promise<CognitoUserSession>((resolve, reject) => {
    user.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log('authenticateUser');
        resolve(result);
      },
      onFailure: (err) => {
        reject(parseCognitoError(err));
      },
    });
  });
}

export async function handleEmailConfirmation(email: string, code: string) {
  const userPool = new CognitoUserPool(POOL_DATA);
  const user = new CognitoUser({
    Username: email,
    Pool: userPool,
  });

  return new Promise((resolve, reject) => {
    user.confirmRegistration(code, true, (err, result) => {
      if (err) {
        if (
          err.message ===
          'User cannot be confirmed. Current status is CONFIRMED'
        ) {
          console.log('SAFFFE');

          return resolve(result);
        }

        reject(parseCognitoError(err));
      }

      resolve(result);
    });
  });
}
export async function handleResendConfirmationCode(email: string) {
  const userPool = new CognitoUserPool(POOL_DATA);
  const user = new CognitoUser({
    Username: email,
    Pool: userPool,
  });

  return new Promise((resolve, reject) => {
    user.resendConfirmationCode((err, result) => {
      if (err) {
        reject(parseCognitoError(err));
      }

      resolve(result);
    });
  });
}
