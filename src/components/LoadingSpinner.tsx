import { Progress } from "@/components/ui/progress";

interface LoadingSpinnerProps {
  status: string;
}

const LoadingSpinner = ({ status }: LoadingSpinnerProps) => {
  // Map API status to progress percentage
  const getProgressFromStatus = (status: string) => {
    switch (status) {
      case "Created":
        return 25;
      case "Processing":
        return 50;
      case "Rendering":
        return 75;
      case "Completed":
        return 100;
      default:
        return 0;
    }
  };

  const progress = getProgressFromStatus(status);

  return (
    <div className="w-full px-8">
      <Progress value={progress} className="h-3 bg-mint/20" />
      <p className="text-center text-sm text-black mt-2">{progress}%</p>
    </div>
  );
};

export default LoadingSpinner;