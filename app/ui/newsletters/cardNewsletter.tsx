import { unsubscribeNewsletter } from '@/app/lib/actions';
import { NewslatterType } from '@/app/lib/definitions';
import { Button } from '@/app/ui/button';
import { BellSlashIcon } from '@heroicons/react/24/solid';

export async function Card(props: NewslatterType) {
  const { title, id, createdname, recipients } = props;
  const unsubscribeNewsletterWithId = unsubscribeNewsletter.bind(null, id);

  const rendeRecipients = () => {
    if (!recipients?.length) return null;
    return (
      <div className="bg-white px-4 py-8">
        <span className="font-medium">Recipients</span>
        <ol>
          {recipients.map(({ id, email, name }) => (
            <li key={id} className="flex gap-2">
              <span>{name}</span>-<span>{email}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  };

  return (
    <div className="relative w-full rounded-xl bg-gray-100 p-2 shadow-sm">
      <div className="mt-4 flex justify-between p-4">
        <h3 className="ml-2 text-lg font-medium">{title}</h3>
        {createdname && <span>Created by {createdname} </span>}
      </div>
      {rendeRecipients()}
      {createdname && (
        <form action={unsubscribeNewsletterWithId}>
          <Button
            className="bg-transparent hover:animate-pulse hover:bg-transparent"
            title="Unsubscribe"
            type="submit"
          >
            <BellSlashIcon className="absolute right-1 top-1 h-8 w-8 text-yellow-500" />
          </Button>
        </form>
      )}
    </div>
  );
}
