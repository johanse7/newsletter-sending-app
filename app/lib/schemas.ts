import { z } from 'zod';
import { ACCEPTED_IMAGE_MIME_TYPES, MAX_FILE_SIZE } from './constants';

export const stringRequiredSchema = z
  .string()
  .trim()
  .min(1, { message: 'Field is Required' });

export const fileSchema = z
  .any()
  .refine((file: File) => {
    return file?.size <= MAX_FILE_SIZE;
  }, `Max image size is 5MB.`)
  .refine(
    (file: File) => ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type),
    'Only .jpg, .jpeg, .png, .webp and pdf formats are supported.',
  );
