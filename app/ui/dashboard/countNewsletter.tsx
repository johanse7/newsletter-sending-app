import { getCountNewsLatter } from '@/app/lib/data';

export const CountNewsletter = async () => {
  const count = await getCountNewsLatter();
  return (
    <div className="flex flex-col rounded-xl bg-gray-50 p-4 shadow-sm">
      <h3 className="text-center text-sm font-medium">Newsletters</h3>
      <span className="mt-3 text-center text-6xl text-sky-400">{count}</span>
    </div>
  );
};
