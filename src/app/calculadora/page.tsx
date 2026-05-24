import CalculadoraTotal from '@/components/CalculadoraTotal';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function CalculadoraPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <CalculadoraTotal />
    </div>
  );
}
