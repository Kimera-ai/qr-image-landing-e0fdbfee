import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface LoadingSpinnerProps {
  status: string;
}

const LoadingSpinner = ({ status }: LoadingSpinnerProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // If status is Completed, immediately set to 100%
    if (status === "Completed") {
      setProgress(100);
      return;
    }

    // Reset progress when starting
    setProgress(0);

    const duration = 80000; // 1 minute and 20 seconds in milliseconds
    const interval = 100; // Update every 100ms for smooth animation
    const steps = duration / interval;
    const increment = 100 / steps; // Increment to reach 100% in 1 minute and 20 seconds

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment;
        return next >= 100 ? 100 : next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [status]);

  return (
    <div className="w-full px-8">
      <Progress 
        value={progress} 
        className="h-4 bg-white/20 rounded-full overflow-hidden border border-white/30"
        indicatorClassName="bg-[#fa2c2e] transition-all"
      />
    </div>
  );
};

export default LoadingSpinner;