import { NewspaperIcon } from '@heroicons/react/24/outline';

export default function Logo() {
  return (
    <div
      className={`flex flex-row  items-center  leading-none text-white gap-2`}
    >
      <NewspaperIcon className="h-12 w-12 " />
      <p className="text-lg leading-5 ">Newsletter App</p>
    </div>
  );
}
