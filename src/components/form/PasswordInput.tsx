import { CheckCircle2, Eye, EyeOff, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { twJoin } from 'tailwind-merge';

import { Input } from '../ui/input';
import { Progress } from '../ui/progress';

type Props = {
  field: ControllerRenderProps<any, any>;
  showCriteria?: boolean;
};

const regexNumber = new RegExp('\\d+');
const regexSpecialCharacter = new RegExp(
  '[!@#$%^&*\\.\\[\\]{}()\\?\\-"!@#%&/\\\\,><\':;|_~`+=]',
);
const regexUppercase = new RegExp('[A-Z]');
const regexLowercase = new RegExp('[a-z]');

const InputCriteria = ({ value, label }: { value: boolean; label: string }) => {
  const SIZE = 15;

  return (
    <div className="flex items-center gap-1">
      {value ? (
        <CheckCircle2 color="#16a34a" size={SIZE} strokeWidth={1.5} />
      ) : (
        <XCircle color="#dc2626" size={SIZE} strokeWidth={1.5} />
      )}
      <span className="text-sm">{label}</span>
    </div>
  );
};

export const PasswordInput = ({ field, showCriteria = true }: Props) => {
  const [wasFocused, setWasFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    currentProgressValue,
    hasLowercase,
    hasNumber,
    hasSpecialCharacter,
    hasUppercase,
    isCorrectLength,
    progressColor,
  } = useMemo(() => {
    const value = field.value;

    const hasNumber = regexNumber.test(value);
    const hasSpecialCharacter = regexSpecialCharacter.test(value);
    const hasUppercase = regexUppercase.test(value);
    const hasLowercase = regexLowercase.test(value);

    const isCorrectLength = value.length >= 8;

    const currentProgressValue = [
      isCorrectLength,
      hasNumber,
      hasSpecialCharacter,
      hasUppercase,
      hasLowercase,
    ].filter((v) => v).length;

    let progressColor = 'bg-gray-300';

    switch (currentProgressValue) {
      case 1:
        progressColor = 'bg-red-500';
        break;
      case 2:
        progressColor = 'bg-orange-500';
        break;
      case 3:
        progressColor = 'bg-yellow-500';
        break;
      case 4:
        progressColor = 'bg-gray-500';
        break;
      case 5:
        progressColor = 'bg-green-500';
        break;
    }

    const isValid =
      isCorrectLength &&
      hasNumber &&
      hasSpecialCharacter &&
      hasUppercase &&
      hasLowercase;

    return {
      isCorrectLength,
      hasNumber,
      hasSpecialCharacter,
      hasUppercase,
      hasLowercase,
      currentProgressValue,
      progressColor,
      isValid,
    };
  }, [field.value]);

  const icon = () => {
    const classes =
      'absolute top-1/2 left-2.5 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer';

    if (showPassword) {
      return (
        <EyeOff className={classes} onClick={() => setShowPassword(false)} />
      );
    } else {
      return <Eye className={classes} onClick={() => setShowPassword(true)} />;
    }
  };

  return (
    <div>
      <div className="relative">
        {icon()}
        <Input
          {...field}
          className="pl-8"
          onFocus={() => setWasFocused(true)}
          type={showPassword ? 'text' : 'password'}
        />
      </div>

      <div
        className={twJoin(
          'flex flex-col gap-0.5 mt-2',
          wasFocused && showCriteria ? 'flex' : 'hidden',
        )}
      >
        <div className="my-1">
          <Progress
            className="w-full rounded"
            indicatorClassName={progressColor}
            max={5}
            value={currentProgressValue}
          />
        </div>
        <InputCriteria label="At least 8 characters" value={isCorrectLength} />
        <InputCriteria label="Has number" value={hasNumber} />
        <InputCriteria
          label="Has special character"
          value={hasSpecialCharacter}
        />
        <InputCriteria label="Has uppercase" value={hasUppercase} />
        <InputCriteria label="Has lowercase" value={hasLowercase} />
      </div>
    </div>
  );
};
