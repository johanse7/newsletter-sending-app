'use client';

import { createNewsletter } from '@/app/lib/actions';
import { UserSelectType } from '@/app/lib/definitions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import Select from 'react-select';

export type CreateFormType = {
  recipients: Array<UserSelectType>;
};
export function CreateForm(props: CreateFormType) {
  const { recipients = [] } = props;

  const [stateFom, actionForm] = useFormState(createNewsletter, null);

  const options = recipients.map(({ name, id, email }) => ({
    label: name,
    value: JSON.stringify({ id, email }),
  }));

  return (
    <form action={actionForm}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Choose a title
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="title"
                name="title"
                type="text"
                step="0.01"
                placeholder="Enter a title"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              {stateFom?.error?.title && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  <span className="font-medium">Oops!</span>{' '}
                  {stateFom.error.title?.[0]}!
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="formFile" className="mb-2 block text-sm font-medium">
            File related to newsletters
          </label>
          <input
            className="focus:border-primary focus:shadow-te-primary relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:text-neutral-700 focus:outline-none  "
            type="file"
            id="fileNewsletter"
            name="fileNewsletter"
          />
          {stateFom?.error?.fileNewsletter && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
              <span className="font-medium">Oops!</span>{' '}
              {stateFom.error.fileNewsletter?.[0]}!
            </p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="formFile" className="mb-2 block text-sm font-medium">
            select any users
          </label>
          <Select options={options} isMulti name="recipients" id="recipients" />

          {stateFom?.error?.recipients && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
              <span className="font-medium">Oops!</span>{' '}
              {stateFom.error.recipients?.[0]}!
            </p>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/newsletters"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>

          <SubmitButton />
        </div>
      </div>
    </form>
  );
}

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button aria-disabled={pending} disabled={pending} type="submit">
      {pending ? 'Submiting' : 'Submit'}
    </Button>
  );
};
