'use server';

import { ACCEPTED_IMAGE_MIME_TYPES, MAX_FILE_SIZE } from '@/app/lib/constants';
import { auth, signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { deleteNewsletter, insertNewslatter, sendEmail } from './data';
import { UserSession } from './definitions';

const FormCreateSchema = z.object({
  title: z.string().trim().min(1, { message: 'Field is Required' }),
  fileNewsletter: z
    .any()
    .refine((file: File) => {
      return file?.size <= MAX_FILE_SIZE;
    }, `Max image size is 5MB.`)
    .refine(
      (file: File) => ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png, .webp and pdf formats are supported.',
    ),
  recipients: z
    .array(z.string())
    .refine((value) => value.length > 0, 'Field is Required'),
});

export const createNewsletter = async (state: any, formData: FormData) => {
  const recipientsFilter = Array.from(formData.entries()).filter(
    ([entry]) => entry === 'recipients',
  );
  const recipients = recipientsFilter
    .flatMap((entry) => {
      if (!entry?.[1]) return {};
      const values = JSON.parse(entry?.[1] as string);
      return {
        id: values?.id,
        email: values.email,
      };
    })
    .filter(Boolean);

  const result = FormCreateSchema.safeParse({
    title: formData.get('title'),
    fileNewsletter: formData.get('fileNewsletter') as File,
    recipients: recipients.map(({ id }) => id),
  });

  if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors,
    };
  }

  //send email
  const formDataEmail = new FormData();
  formDataEmail.append('file', result?.data?.fileNewsletter);
  formDataEmail.append('title', result?.data?.title);
  formDataEmail.append(
    'emails',
    recipients.map(({ email }) => email).join(','),
  );

  await sendEmail(formDataEmail);

  const { title, fileNewsletter } = result.data;
  const userSession = (await auth()) as UserSession;

  await insertNewslatter({
    file: fileNewsletter,
    title,
    userId: userSession.id,
    recipientIds: result.data.recipients,
  });

  revalidatePath('/dashboard/newsletters');
  redirect('/dashboard/newsletters');
};

export const unsubscribeNewsletter = async (newsletteId: string) => {
  const userSession = (await auth()) as UserSession;
  const success = await deleteNewsletter(newsletteId, userSession.id);
  if (success) revalidatePath('/dashboard/newsletters');
};

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
