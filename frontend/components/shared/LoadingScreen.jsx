import { Spinner } from '@/components/ui';

export default function LoadingScreen({ text = 'Loading DealFlow AI...' }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <Spinner className="mx-auto" />
        <p className="mt-3 text-sm text-slate-400">{text}</p>
      </div>
    </div>
  );
}
