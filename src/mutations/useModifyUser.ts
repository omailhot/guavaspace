import { useMutation } from '@tanstack/react-query';
import {
  CognitoUserPool,
  ICognitoUserAttributeData,
} from 'amazon-cognito-identity-js';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { handleAPIError } from '../lib/api';
import { POOL_DATA } from '../lib/cognito/UserPool';
import { ProfileUserFormType } from '../routes/profile/sections/User';

export const handleModifyUser = async (data: ProfileUserFormType) => {
  const userPool = new CognitoUserPool(POOL_DATA);
  const user = userPool.getCurrentUser();

  if (!user) {
    console.log('no user');

    return;
  }

  const attributes = (
    Object.keys(data) as (keyof ProfileUserFormType)[]
  ).reduce<ICognitoUserAttributeData[]>((acc, value) => {
    const attr = data[value];

    acc.push({
      Name: value,
      Value: attr instanceof Date ? format(attr, 'MM/dd/yyyy') : attr,
    });

    return acc;
  }, []);

  await new Promise((resolve, reject) => {
    user.getSession((err: Error | null) => {
      if (err) {
        return reject(err);
      }

      user.updateAttributes(attributes, (err, resp) => {
        if (err) {
          return reject(err);
        }

        resolve(resp);
      });
    });
  });
};

export const useModifyUser = () => {
  const { t } = useTranslation(['create-rental']);

  const mutation = useMutation({
    mutationFn: handleModifyUser,
    onError: (error: any) => {
      const parsedError = handleAPIError(error);

      toast.error(t(parsedError.messageKey));
    },
    onSuccess: () => {
      toast.success(t('reservation:success'));
    },
  });

  return mutation;
};
