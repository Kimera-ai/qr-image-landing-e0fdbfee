import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface LoadingSpinnerProps {
  status: string;
}

const LoadingSpinner = ({ status }: LoadingSpinnerProps) => {
  const [progress, setProgress] = useState(0);

  // Map API status to progress percentage ranges
  const getProgressRange = (status: string) => {
    switch (status) {
      case "Created":
        return { min: 0, max: 25 };
      case "Processing":
        return { min: 25, max: 50 };
      case "Rendering":
        return { min: 50, max: 75 };
      case "Completed":
        return { min: 100, max: 100 }; // Set both min and max to 100 when completed
      default:
        return { min: 0, max: 25 };
    }
  };

  useEffect(() => {
    const range = getProgressRange(status);
    
    // If status is Completed, immediately set to 100% and don't animate
    if (status === "Completed") {
      setProgress(100);
      return;
    }

    const duration = 60000; // 1 minute in milliseconds
    const interval = 100; // Update every 100ms for smooth animation
    const steps = duration / interval;
    const increment = (range.max - range.min) / steps;

    let currentProgress = range.min;
    
    const timer = setInterval(() => {
      if (currentProgress < range.max) {
        currentProgress += increment;
        setProgress(Math.min(currentProgress, range.max));
      }
    }, interval);

    // Reset progress when status changes
    setProgress(range.min);

    return () => clearInterval(timer);
  }, [status]);

  return (
    <div className="w-full px-8">
      <Progress 
        value={progress} 
        className="h-4 bg-mint/20 rounded-full overflow-hidden"
      />
    </div>
  );
};

export default LoadingSpinner;