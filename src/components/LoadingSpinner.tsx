import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

const LoadingSpinner = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress while waiting for completion
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 90) {
          // Cap at 90% until we get "Completed" status
          return 90;
        }
        return prevProgress + 10;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full px-8">
      <Progress value={progress} className="h-3 bg-mint/20" />
      <p className="text-center text-sm text-black mt-2">{progress}%</p>
    </div>
  );
};

export default LoadingSpinner;