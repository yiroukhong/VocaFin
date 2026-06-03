import { useBudget } from '@/hooks/useBudget';
import { useTransactions } from '@/hooks/useTransactions';
import { getTopCategory } from '@/utils/financeAccessibility';
import { FileInput, History, BarChart3, Mic, Wallet } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { remainingBudget, totalSpentThisMonth } = useBudget();
  const { transactions } = useTransactions();
  const navigate = useNavigate();
  
  // Safe check in case getTopCategory isn't fully implemented yet
  const topData = getTopCategory ? getTopCategory(transactions) : ['None', 0];
  const topCategory = topData[0];

  // Keyboard shortcut for accessibility
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === ' ') {
        event.preventDefault();
        navigate('/log');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate]);

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white select-none overflow-hidden">
      
      {/* Invisible live region for screen readers (Announces budget on load) */}
      <div aria-live="polite" role="status" className="sr-only">
        Voca Fin Home. Remaining budget RM {remainingBudget.toFixed(2)}. Total spent RM {totalSpentThisMonth.toFixed(2)}. Top category {topCategory}.
      </div>

      {/* Top Bar matching Figma */}
      <header className="flex items-center gap-3 p-4 border-b border-gray-800 bg-[#111]">
        <Wallet className="h-6 w-6 text-orange-300" strokeWidth={2} />
        <h1 className="text-2xl font-bold tracking-wide">VocaFin</h1>
      </header>

      {/* 2x2 Massive Grid Navigation */}
      <main 
        className="flex-1 grid grid-cols-2 grid-rows-2 gap-1 p-1 bg-gray-900" 
        aria-label="Main Navigation Menu"
      >
        <button
          onClick={() => navigate('/extract')}
          className="flex flex-col items-center justify-center bg-black border-2 border-white/20 focus:border-cyan-400 focus:ring-inset transition-colors"
          aria-label="Extract Document"
        >
          <FileInput className="h-28 w-28 mb-4 text-white" strokeWidth={1.5} />
          <span className="text-3xl font-medium tracking-widest">Extract</span>
        </button>

        <button
          onClick={() => navigate('/history')}
          className="flex flex-col items-center justify-center bg-black border-2 border-white/20 focus:border-cyan-400 focus:ring-inset transition-colors"
          aria-label="Transaction History"
        >
          <History className="h-28 w-28 mb-4 text-white" strokeWidth={1.5} />
          <span className="text-3xl font-medium tracking-widest">History</span>
        </button>

        <button
          onClick={() => navigate('/summary')}
          className="flex flex-col items-center justify-center bg-black border-2 border-white/20 focus:border-cyan-400 focus:ring-inset transition-colors"
          aria-label="Budget Summary"
        >
          <BarChart3 className="h-28 w-28 mb-4 text-white" strokeWidth={1.5} />
          <span className="text-3xl font-medium tracking-widest">Summary</span>
        </button>

        <button
          onClick={() => navigate('/log')}
          className="flex flex-col items-center justify-center bg-black border-2 border-white/20 focus:border-cyan-400 focus:ring-inset transition-colors"
          aria-label="Voice Expense Logger"
        >
          <Mic className="h-28 w-28 mb-4 text-white" strokeWidth={1.5} />
          <span className="text-3xl font-medium tracking-widest">Voice</span>
        </button>
      </main>
    </div>
  );
}