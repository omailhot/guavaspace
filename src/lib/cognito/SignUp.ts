import {
  CognitoUserAttribute,
  CognitoUserPool,
  ISignUpResult,
} from 'amazon-cognito-identity-js';

import { useAuthFlowStore } from '../../stores/useAuthFlowStore';
import { SerializedUserType, serializeUser, UserType } from '../../types/User';
import { parseCognitoError } from './Errors';
import { POOL_DATA } from './UserPool';

const handleDataToCognitoUserAttribute = (data: SerializedUserType) => {
  const toExcludeKeys = ['email', 'password'];

  return (Object.keys(data) as Array<keyof SerializedUserType>)
    .filter((key) => !toExcludeKeys.includes(key))
    .map((key) => {
      const keeValuePair = new CognitoUserAttribute({
        Name: key,
        Value: data[key].toString(),
      });

      return keeValuePair;
    });
};

export async function handleSignup(data: UserType) {
  const serializeData = serializeUser(data);

  const userPool = new CognitoUserPool(POOL_DATA);

  return new Promise<ISignUpResult>((resolve, reject) => {
    useAuthFlowStore.getState().setUsername(serializeData.email);

    userPool.signUp(
      serializeData.email,
      serializeData.password,
      handleDataToCognitoUserAttribute(serializeData),
      [],
      (err: any, result) => {
        if (err || !result) {
          reject(parseCognitoError(err));

          return;
        }

        resolve(result);
      },
    );
  });
}
