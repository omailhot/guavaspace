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
        messageKey: 'translation:erros.UsernameExistsException',
      };
    case 'TooManyRequestsException':
      return {
        code: 'TooManyRequestsException',
        messageKey: 'translation:erros.TooManyRequestsException',
      };
    case 'InvalidParameterException':
      return {
        code: 'InvalidParameterException',
        messageKey: 'translation:erros.InvalidParameterException',
      };
    case 'InvalidPasswordException': {
      return {
        code: 'InvalidPasswordException',
        messageKey: 'translation:erros.InvalidPasswordException',
      };
    }
    case 'CodeMismatchException': {
      return {
        code: 'CodeMismatchException',
        messageKey: 'translation:erros.CodeMismatchException',
      };
    }
    case 'NotAuthorizedException': {
      return {
        code: 'NotAuthorizedException',
        messageKey: 'translation:erros.NotAuthorizedException',
      };
    }
    case 'UserNotConfirmedException': {
      return {
        code: 'UserNotConfirmedException',
        messageKey: 'translation:erros.UserNotConfirmedException',
      };
    }
    case 'UserNotFoundException': {
      return {
        code: 'UserNotFoundException',
        messageKey: 'translation:erros.UserNotFoundException',
      };
    }
    case 'LimitExceededException': {
      return {
        code: 'LimitExceededException',
        messageKey: 'translation:erros.LimitExceededException',
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
        messageKey: 'translation:erros.default',
      };
  }
};

export const handleCogintoError = (err: CognitoError | any): CognitoError => {
  return {
    code: err?.code ?? 'DefaultError',
    messageKey: err?.messageKey ?? 'translation:erros.default',
  };
};
