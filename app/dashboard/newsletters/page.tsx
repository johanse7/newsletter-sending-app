import { CardsSkeleton } from '@/app/ui/skeletons';
import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Suspense } from 'react';
import { NewsletterList } from '../../ui/newsletters/newsletterList';

export default async function NewslettersPage() {
  return (
    <div className="w-full">
      <div className="flex justify-between">
        <h1 className={`mb-4 text-xl md:text-2xl`}>My Newsletters</h1>
        <Link
          href="/dashboard/newsletters/create"
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <span className="hidden md:block">Add a newsletters</span>
          <PlusIcon className="h-5 md:ml-4" />
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        <Suspense fallback={<CardsSkeleton />}>
          <NewsletterList />
        </Suspense>
      </div>
    </div>
  );
}
