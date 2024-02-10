import { Suspense } from 'react';
import CardWrapper from '../ui/dashboard/cards';
import { lusitana } from '../ui/fonts';
import { CardsSkeleton } from '../ui/skeletons';
import { CountNewsletter } from '../ui/dashboard/countNewsletter';

export default async function DashboardPage() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CountNewsletter />
        </Suspense>
      </div>
    </main>
  );
}
