import MainCalculator from '@/components/MainCalculator';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center p-4">
      <MainCalculator />
    </div>
  );
}
