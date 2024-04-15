import { CognitoUser } from 'amazon-cognito-identity-js';

import { parseCognitoError } from './Errors';
import { UserPool } from './UserPool';

export const handleResetPassword = async (
  username: string,
  verificationCode: string,
  newPassword: string,
): Promise<void> => {
  const user = new CognitoUser({
    Username: username,
    Pool: UserPool,
  });

  return new Promise((resolve, reject) => {
    user.confirmPassword(verificationCode, newPassword, {
      onSuccess: () => {
        resolve();
      },
      onFailure: (err) => {
        reject(parseCognitoError(err));
      },
    });
  });
};
