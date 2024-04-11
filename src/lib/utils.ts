import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { OfficePictureType } from '@/types/Picture';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ERROR_KEY_PREFIX = 'LOCALIZED_';

export function formatErrorKey(key: string) {
  return ERROR_KEY_PREFIX + key;
}

export function isErrorKey(key: string) {
  return key.startsWith(ERROR_KEY_PREFIX);
}

export function getKeyFromErrorKey(key: string) {
  return key.replace(ERROR_KEY_PREFIX, '');
}

export function getLowestRankPicturePath(pictures: OfficePictureType[]) {
  if (pictures.length === 0) return '';
  return pictures.reduce((prev, current) => {
    return prev.pictureOrder < current.pictureOrder ? prev : current;
  }).picturePath;
}

export function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
