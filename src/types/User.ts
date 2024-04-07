import { format } from 'date-fns';
import * as v from 'valibot';

import { formatErrorKey } from '../lib/utils';

export const UserSchema = v.object({
  email: v.string([v.email()]),
  password: v.string([
    v.minLength(
      8,
      formatErrorKey('auth:fields.password.validations.min_length'),
    ),
    v.maxLength(
      255,
      formatErrorKey('auth:fields.password.validations.max_length'),
    ),
    v.regex(/\d/, formatErrorKey('auth:fields.password.validations.number')),
    v.regex(
      /[!@#$%^&*]/,
      formatErrorKey('auth:fields.password.validations.symbol'),
    ),
    v.regex(
      /[a-z]/,
      formatErrorKey('auth:fields.password.validations.lowercase'),
    ),
    v.regex(
      /[A-Z]/,
      formatErrorKey('auth:fields.password.validations.uppercase'),
    ),
  ]),
  given_name: v.string(),
  family_name: v.string(),
  birthdate: v.date(),
  phone_number: v.string(),
});

export const serializeUser = (user: UserType) => {
  return {
    ...user,
    birthdate: format(user.birthdate, 'MM/dd/yyyy'),
  };
};

export type UserType = v.Output<typeof UserSchema>;
export type SerializedUserType = ReturnType<typeof serializeUser>;

export const SignInSchema = v.pick(UserSchema, ['email', 'password']);
export type SignInType = v.Output<typeof SignInSchema>;

export const ConfirmnEmailSchema = v.object({
  code: v.string(),
});
export type ConfirmEmailType = v.Output<typeof ConfirmnEmailSchema>;

export const ForgotPasswordSchema = v.object({
  username: v.string(),
});
export type ForgotPasswordType = v.Output<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = v.object({
  code: v.string(),
  newPassword: v.string(),
});
export type ResetPasswordType = v.Output<typeof ResetPasswordSchema>;

export const CognitoUserSchema = v.object({
  aud: v.string(),
  auth_time: v.number(),
  birthdate: v.string(),
  'cognito:username': v.string(),
  email: v.string(),
  email_verified: v.boolean(),
  event_id: v.string(),
  exp: v.number(),
  family_name: v.string(),
  given_name: v.string(),
  iat: v.number(),
  iss: v.string([v.url()]),
  jti: v.string(),
  origin_jti: v.string(),
  phone_number: v.string(),
  phone_number_verified: v.boolean(),
  sub: v.string(),
  token_use: v.string(),
});

export type CognitoUserType = v.Output<typeof CognitoUserSchema>;
