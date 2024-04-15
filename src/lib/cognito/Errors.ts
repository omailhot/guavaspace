export const HANDLED_ERRORS = [
  'UsernameExistsException',
  'TooManyRequestsException',
  'InvalidParameterException',
  'InvalidPasswordException',
  'CodeMismatchException',
  'NotAuthorizedException',
  'UserNotConfirmedException',
  'UserNotFoundException',
  'LimitExceededException',
  'DefaultError',
] as const;

export type HandledErrors = (typeof HANDLED_ERRORS)[number];

export type CognitoError = {
  code: HandledErrors;
  messageKey: string;
};

export const parseCognitoError = (err: any): CognitoError => {
  switch (err.code) {
    case 'UsernameExistsException':
      return {
        code: 'UsernameExistsException',
        messageKey: 'translation:errors.UsernameExistsException',
      };
    case 'TooManyRequestsException':
      return {
        code: 'TooManyRequestsException',
        messageKey: 'translation:errors.TooManyRequestsException',
      };
    case 'InvalidParameterException':
      return {
        code: 'InvalidParameterException',
        messageKey: 'translation:errors.InvalidParameterException',
      };
    case 'InvalidPasswordException': {
      return {
        code: 'InvalidPasswordException',
        messageKey: 'translation:errors.InvalidPasswordException',
      };
    }
    case 'CodeMismatchException': {
      return {
        code: 'CodeMismatchException',
        messageKey: 'translation:errors.CodeMismatchException',
      };
    }
    case 'NotAuthorizedException': {
      return {
        code: 'NotAuthorizedException',
        messageKey: 'translation:errors.NotAuthorizedException',
      };
    }
    case 'UserNotConfirmedException': {
      return {
        code: 'UserNotConfirmedException',
        messageKey: 'translation:errors.UserNotConfirmedException',
      };
    }
    case 'UserNotFoundException': {
      return {
        code: 'UserNotFoundException',
        messageKey: 'translation:errors.UserNotFoundException',
      };
    }
    case 'LimitExceededException': {
      return {
        code: 'LimitExceededException',
        messageKey: 'translation:errors.LimitExceededException',
      };
    }
    /**
     * ? This is the default error message.
     *
     * Happens if the error code is not handled or if the error has no code.
     */
    default:
      return {
        code: 'DefaultError',
        messageKey: 'translation:errors.default',
      };
  }
};

export const handleCogintoError = (err: CognitoError | any): CognitoError => {
  return {
    code: err?.code ?? 'DefaultError',
    messageKey: err?.messageKey ?? 'translation:errors.default',
  };
};
