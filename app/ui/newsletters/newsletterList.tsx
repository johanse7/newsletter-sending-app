import { UserSession } from '@/app/lib/actions';
import { getNewslattersByRole } from '@/app/lib/services';
import { auth } from '@/auth';
import { Card } from './cardNewsletter';

export async function NewsletterList() {
  const session = (await auth()) as UserSession;
  if (!session) return null;

  const newslatters = await getNewslattersByRole(session.isAdmin, session.id);

  if (!newslatters?.length)
    return <p className="mt-4 text-gray-400">No data available.</p>;

  return (
    <>
      {newslatters.map((item) => (
        <Card key={item.id} {...item} />
      ))}
    </>
  );
}
