// import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { ACCEPTED_IMAGE_MIME_TYPES, MAX_FILE_SIZE } from '@/app/lib/constants';
import { EmailTemplate } from '@/app/ui/emailTemplate';
import { Resend } from 'resend';
import { z } from 'zod';

const emailSchema = z.object({
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
  emails: z.string().trim().min(1, { message: 'Field is Required' }),
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const result = emailSchema.safeParse({
      title: formData.get('title'),
      fileNewsletter: formData.get('file') as File,
      emails: formData.get('emails'),
    });

    if (!result.success) {
      return Response.json({ error: result.error.formErrors });
    }

    const { emails, title, fileNewsletter } = result.data;

    const buffer = Buffer.from(await fileNewsletter.arrayBuffer());
    await resend.emails.send({
      from: 'Newslatter app <onboarding@resend.dev>',
      to: emails.split(','),
      subject: 'Hello world',
      react: EmailTemplate({ titleNewsletter: title }),
      text: '',
      attachments: [
        {
          filename: (fileNewsletter as File).name,
          content: buffer,
        },
      ],
    });

    return Response.json(
      {
        status: 'Ok',
      },
      {
        status: 200,
      },
    );
  } catch (e) {
    if (e instanceof Error) {
      console.log(`Failed to send email: ${e.message}`);
    }
    return Response.json(
      {
        error: 'Internal server error.',
      },
      {
        status: 500,
      },
    );
  }
}
