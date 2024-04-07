import { CognitoUser } from 'amazon-cognito-identity-js';

import { parseCognitoError } from './Errors';
import { UserPool } from './UserPool';

export const handleForgotPassword = async (username: string): Promise<void> => {
  const user = new CognitoUser({
    Username: username,
    Pool: UserPool,
  });

  return new Promise((resolve, reject) => {
    user.forgotPassword({
      onSuccess: () => {
        resolve();
      },
      onFailure: (err) => {
        reject(parseCognitoError(err));
      },
      inputVerificationCode: () => {
        resolve();
      },
    });
  });
};

export const handleResendForgotPasswordCode = async (
  username: string,
): Promise<void> => {
  const user = new CognitoUser({
    Username: username,
    Pool: UserPool,
  });

  return new Promise((resolve, reject) => {
    user.resendConfirmationCode((err) => {
      if (err) {
        reject(parseCognitoError(err));
        return;
      }

      resolve();
    });
  });
};
