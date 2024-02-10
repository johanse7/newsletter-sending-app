import { getAllUser } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { CreateForm } from '../../../ui/newsletters/createForm';

export default async function CreateNewsletterPage() {
  const recipients = await getAllUser();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'My newsletter', href: '/dashboard/newsletters' },
          {
            label: 'new',
            href: '/dashboard/newsletters/create',
            active: true,
          },
        ]}
      />
      <CreateForm recipients={recipients} />
    </main>
  );
}
