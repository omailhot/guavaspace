import * as v from 'valibot';

export const SignUpResponseSchema = v.object({
  CodeDeliveryDetails: v.object({
    AttributeName: v.string(),
    DeliveryMedium: v.string(),
    Destination: v.string(),
  }),
  UserConfirmed: v.boolean(),
  UserSub: v.string(),
});

export type SignUpResponse = v.Output<typeof SignUpResponseSchema>;

export const parseCognitoResult = (result: any) => {
  if ('__type' in result) {
    return {
      error: {
        code: result.__type,
        message: result.message,
      },
    };
  }

  return result;
};

export const COGNITO_ERROR_TYPES = ['NotAuthorizedException'];
