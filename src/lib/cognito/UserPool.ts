import {
  CognitoUserPool,
  CognitoUserSession,
  ICognitoUserPoolData,
} from 'amazon-cognito-identity-js';

import { parseCognitoError } from './Errors';

export const POOL_DATA: ICognitoUserPoolData = {
  UserPoolId: 'us-east-1_8rYQyc801',
  ClientId: '25at8sg3okq1g2fqoh7vdubkcj',
} as const;

export async function getUserSession(): Promise<CognitoUserSession> {
  const userPool = new CognitoUserPool(POOL_DATA);
  const user = userPool.getCurrentUser();

  return new Promise((resolve, reject) => {
    if (!user) {
      reject(
        parseCognitoError({
          code: 'UserNotFoundException',
        }),
      );

      return;
    }

    user.getSession((err: any, session: any) => {
      if (err) {
        reject(parseCognitoError(err));
      } else {
        resolve(session as CognitoUserSession);

        /* const _session = session as CognitoUserSession;
        user.refreshSession(_session.getRefreshToken(), (err, session) => {
          if (err) {
            user.signOut(() => {
              reject(parseCognitoError(err));
            });
          } else {
            resolve(session as CognitoUserSession);
          }
        }); */
      }
    });
  });
}

export const handleSignout = () => {
  const userPool = new CognitoUserPool(POOL_DATA);
  const user = userPool.getCurrentUser();

  if (user) {
    user.signOut();
  }
};

export const UserPool = new CognitoUserPool(POOL_DATA);
